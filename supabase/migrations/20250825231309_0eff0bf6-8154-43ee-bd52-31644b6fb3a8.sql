-- Add RLS policies for remaining archive tables

-- RLS policies for call_archive
CREATE POLICY "Users can access call archive from their organization"
ON public.call_archive
FOR SELECT
TO authenticated
USING (
  id_organization IN (SELECT public.user_organization_ids(auth.uid()))
  OR public.has_role(auth.uid(), 'XEVON')
  OR public.has_role(auth.uid(), 'Admin')
);

CREATE POLICY "Users can insert call archive for their organization"
ON public.call_archive
FOR INSERT
TO authenticated
WITH CHECK (
  id_organization IN (SELECT public.user_organization_ids(auth.uid()))
  OR public.has_role(auth.uid(), 'XEVON')
  OR public.has_role(auth.uid(), 'Admin')
);

CREATE POLICY "Users can update call archive for their organization"
ON public.call_archive
FOR UPDATE
TO authenticated
USING (
  id_organization IN (SELECT public.user_organization_ids(auth.uid()))
  OR public.has_role(auth.uid(), 'XEVON')
  OR public.has_role(auth.uid(), 'Admin')
);

CREATE POLICY "Users can delete call archive for their organization"
ON public.call_archive
FOR DELETE
TO authenticated
USING (
  id_organization IN (SELECT public.user_organization_ids(auth.uid()))
  OR public.has_role(auth.uid(), 'XEVON')
  OR public.has_role(auth.uid(), 'Admin')
);

-- RLS policies for message_archive
CREATE POLICY "Users can access message archive from their organization"
ON public.message_archive
FOR SELECT
TO authenticated
USING (
  id_organization IN (SELECT public.user_organization_ids(auth.uid()))
  OR public.has_role(auth.uid(), 'XEVON')
  OR public.has_role(auth.uid(), 'Admin')
);

CREATE POLICY "Users can insert message archive for their organization"
ON public.message_archive
FOR INSERT
TO authenticated
WITH CHECK (
  id_organization IN (SELECT public.user_organization_ids(auth.uid()))
  OR public.has_role(auth.uid(), 'XEVON')
  OR public.has_role(auth.uid(), 'Admin')
);

CREATE POLICY "Users can update message archive for their organization"
ON public.message_archive
FOR UPDATE
TO authenticated
USING (
  id_organization IN (SELECT public.user_organization_ids(auth.uid()))
  OR public.has_role(auth.uid(), 'XEVON')
  OR public.has_role(auth.uid(), 'Admin')
);

CREATE POLICY "Users can delete message archive for their organization"
ON public.message_archive
FOR DELETE
TO authenticated
USING (
  id_organization IN (SELECT public.user_organization_ids(auth.uid()))
  OR public.has_role(auth.uid(), 'XEVON')
  OR public.has_role(auth.uid(), 'Admin')
);

-- RLS policies for task_archive
CREATE POLICY "Users can access task archive from their organization"
ON public.task_archive
FOR SELECT
TO authenticated
USING (
  id_organization IN (SELECT public.user_organization_ids(auth.uid()))
  OR public.has_role(auth.uid(), 'XEVON')
  OR public.has_role(auth.uid(), 'Admin')
);

CREATE POLICY "Users can insert task archive for their organization"
ON public.task_archive
FOR INSERT
TO authenticated
WITH CHECK (
  id_organization IN (SELECT public.user_organization_ids(auth.uid()))
  OR public.has_role(auth.uid(), 'XEVON')
  OR public.has_role(auth.uid(), 'Admin')
);

CREATE POLICY "Users can update task archive for their organization"
ON public.task_archive
FOR UPDATE
TO authenticated
USING (
  id_organization IN (SELECT public.user_organization_ids(auth.uid()))
  OR public.has_role(auth.uid(), 'XEVON')
  OR public.has_role(auth.uid(), 'Admin')
);

CREATE POLICY "Users can delete task archive for their organization"
ON public.task_archive
FOR DELETE
TO authenticated
USING (
  id_organization IN (SELECT public.user_organization_ids(auth.uid()))
  OR public.has_role(auth.uid(), 'XEVON')
  OR public.has_role(auth.uid(), 'Admin')
);

-- RLS policies for ticket_archive
CREATE POLICY "Users can access ticket archive from their organization"
ON public.ticket_archive
FOR SELECT
TO authenticated
USING (
  id_organization IN (SELECT public.user_organization_ids(auth.uid()))
  OR public.has_role(auth.uid(), 'XEVON')
  OR public.has_role(auth.uid(), 'Admin')
);

CREATE POLICY "Users can insert ticket archive for their organization"
ON public.ticket_archive
FOR INSERT
TO authenticated
WITH CHECK (
  id_organization IN (SELECT public.user_organization_ids(auth.uid()))
  OR public.has_role(auth.uid(), 'XEVON')
  OR public.has_role(auth.uid(), 'Admin')
);

CREATE POLICY "Users can update ticket archive for their organization"
ON public.ticket_archive
FOR UPDATE
TO authenticated
USING (
  id_organization IN (SELECT public.user_organization_ids(auth.uid()))
  OR public.has_role(auth.uid(), 'XEVON')
  OR public.has_role(auth.uid(), 'Admin')
);

CREATE POLICY "Users can delete ticket archive for their organization"
ON public.ticket_archive
FOR DELETE
TO authenticated
USING (
  id_organization IN (SELECT public.user_organization_ids(auth.uid()))
  OR public.has_role(auth.uid(), 'XEVONS')
  OR public.has_role(auth.uid(), 'Admin')
);

-- Enable RLS on remaining tables that might not have it
ALTER TABLE public.call_archive ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_archive ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_archive ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ticket_archive ENABLE ROW LEVEL SECURITY;

-- Add RLS policies for remaining tables that need policies
-- Tables that might not have policies yet

-- RLS policies for elevenlabs_agent
ALTER TABLE public.elevenlabs_agent ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can access elevenlabs agent from their organization"
ON public.elevenlabs_agent
FOR SELECT
TO authenticated
USING (
  id_organization IN (SELECT public.user_organization_ids(auth.uid()))
  OR public.has_role(auth.uid(), 'XEVON')
  OR public.has_role(auth.uid(), 'Admin')
);

CREATE POLICY "Only admins can modify elevenlabs agent"
ON public.elevenlabs_agent
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'XEVON') OR public.has_role(auth.uid(), 'Admin'));

CREATE POLICY "Only admins can update elevenlabs agent"
ON public.elevenlabs_agent
FOR UPDATE
TO authenticated  
USING (public.has_role(auth.uid(), 'XEVON') OR public.has_role(auth.uid(), 'Admin'));

CREATE POLICY "Only admins can delete elevenlabs agent"
ON public.elevenlabs_agent
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'XEVON') OR public.has_role(auth.uid(), 'Admin'));

-- RLS policies for history_payment
ALTER TABLE public.history_payment ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can access payment history from their organization"
ON public.history_payment
FOR SELECT
TO authenticated
USING (
  id_organization IN (SELECT public.user_organization_ids(auth.uid()))
  OR public.has_role(auth.uid(), 'XEVON')
  OR public.has_role(auth.uid(), 'Admin')
);

CREATE POLICY "Only admins can modify payment history"
ON public.history_payment
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'XEVON') OR public.has_role(auth.uid(), 'Admin'));

-- RLS policies for history_remaining_min_mesg
ALTER TABLE public.history_remaining_min_mesg ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can access remaining usage from their organization"
ON public.history_remaining_min_mesg
FOR SELECT
TO authenticated
USING (
  id_organization IN (SELECT public.user_organization_ids(auth.uid()))
  OR public.has_role(auth.uid(), 'XEVON')
  OR public.has_role(auth.uid(), 'Admin')
);

CREATE POLICY "Only admins can modify remaining usage"
ON public.history_remaining_min_mesg
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'XEVON') OR public.has_role(auth.uid(), 'Admin'));

-- RLS policies for twilio_numbers
ALTER TABLE public.twilio_numbers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can access twilio numbers from their organization"
ON public.twilio_numbers
FOR SELECT
TO authenticated
USING (
  id_organization IN (SELECT public.user_organization_ids(auth.uid()))
  OR public.has_role(auth.uid(), 'XEVON')
  OR public.has_role(auth.uid(), 'Admin')
);

CREATE POLICY "Only admins can modify twilio numbers"
ON public.twilio_numbers
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'XEVON') OR public.has_role(auth.uid(), 'Admin'));

CREATE POLICY "Only admins can update twilio numbers"
ON public.twilio_numbers
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'XEVON') OR public.has_role(auth.uid(), 'Admin'));

CREATE POLICY "Only admins can delete twilio numbers"
ON public.twilio_numbers
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'XEVON') OR public.has_role(auth.uid(), 'Admin'));

-- RLS policies for tables and workflows (system tables)
ALTER TABLE public.tables ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workflows ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only admins can access system tables"
ON public.tables
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'XEVON') OR public.has_role(auth.uid(), 'Admin'))
WITH CHECK (public.has_role(auth.uid(), 'XEVON') OR public.has_role(auth.uid(), 'Admin'));

CREATE POLICY "Only admins can access workflows"
ON public.workflows
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'XEVON') OR public.has_role(auth.uid(), 'Admin'))
WITH CHECK (public.has_role(auth.uid(), 'XEVON') OR public.has_role(auth.uid(), 'Admin'));