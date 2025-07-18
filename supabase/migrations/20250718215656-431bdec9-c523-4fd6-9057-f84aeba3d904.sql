-- Criar tabela de contacts
CREATE TABLE public.contacts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  phone_number TEXT NOT NULL UNIQUE,
  name TEXT,
  email TEXT,
  avatar_url TEXT,
  organization TEXT,
  notes TEXT,
  tags TEXT[],
  is_blocked BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS na tabela contacts
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;

-- Criar políticas RLS para contacts
CREATE POLICY "Users can view all contacts" 
ON public.contacts 
FOR SELECT 
USING (true);

CREATE POLICY "Users can insert contacts" 
ON public.contacts 
FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE user_id = auth.uid()
));

CREATE POLICY "Users can update contacts" 
ON public.contacts 
FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM public.profiles 
  WHERE user_id = auth.uid()
));

-- Adicionar colunas contact_id nas tabelas existentes
ALTER TABLE public.messages ADD COLUMN contact_id UUID REFERENCES public.contacts(id);
ALTER TABLE public.tickets ADD COLUMN contact_id UUID REFERENCES public.contacts(id);
ALTER TABLE public.calls ADD COLUMN contact_id UUID REFERENCES public.contacts(id);

-- Criar índices para melhor performance
CREATE INDEX idx_messages_contact_id ON public.messages(contact_id);
CREATE INDEX idx_tickets_contact_id ON public.tickets(contact_id);
CREATE INDEX idx_calls_contact_id ON public.calls(contact_id);
CREATE INDEX idx_contacts_phone_number ON public.contacts(phone_number);

-- Criar trigger para atualizar updated_at
CREATE TRIGGER update_contacts_updated_at
BEFORE UPDATE ON public.contacts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Atualizar RLS para tasks com categoria X - users não podem ver
DROP POLICY IF EXISTS "Users can view non-archived tasks based on role" ON public.tasks;

CREATE POLICY "Users can view non-archived tasks based on role" 
ON public.tasks 
FOR SELECT 
USING (
  (archived = false) AND 
  (EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.user_id = auth.uid() AND (
      (p.role = 'developer'::user_role) OR 
      (p.role = 'manager'::user_role AND p.team::text = tasks.team::text) OR 
      (tasks.assignee_id = auth.uid())
    ) AND (
      category != 'X' OR p.role != 'user'::user_role
    )
  ))
);