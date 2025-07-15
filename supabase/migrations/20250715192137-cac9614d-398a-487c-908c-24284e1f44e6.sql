-- Create role enum
CREATE TYPE public.user_role AS ENUM ('developer', 'manager', 'user');

-- Create team enum
CREATE TYPE public.team_type AS ENUM ('technical', 'support', 'sales', 'management');

-- Create task status enum
CREATE TYPE public.task_status AS ENUM ('pending', 'in_progress', 'completed');

-- Create task priority enum
CREATE TYPE public.task_priority AS ENUM ('low', 'medium', 'high');

-- Create ticket status enum
CREATE TYPE public.ticket_status AS ENUM ('open', 'in_progress', 'proposed_solution', 'closed');

-- Create ticket priority enum
CREATE TYPE public.ticket_priority AS ENUM ('low', 'medium', 'high');

-- Create ticket type enum
CREATE TYPE public.ticket_type AS ENUM ('bug', 'feature_request', 'support', 'integration', 'configuration');

-- Create call status enum
CREATE TYPE public.call_status AS ENUM ('active', 'completed', 'missed', 'failed');

-- Create message status enum
CREATE TYPE public.message_status AS ENUM ('sent', 'delivered', 'read', 'failed');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'user',
  team team_type NOT NULL DEFAULT 'support',
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create tasks table
CREATE TABLE public.tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  status task_status DEFAULT 'pending' NOT NULL,
  priority task_priority DEFAULT 'medium' NOT NULL,
  assignee_id UUID REFERENCES public.profiles(user_id) ON DELETE SET NULL,
  team team_type NOT NULL,
  category TEXT NOT NULL,
  due_date DATE,
  created_by UUID REFERENCES public.profiles(user_id) ON DELETE SET NULL NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create tickets table
CREATE TABLE public.tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  type ticket_type DEFAULT 'support' NOT NULL,
  status ticket_status DEFAULT 'open' NOT NULL,
  priority ticket_priority DEFAULT 'medium' NOT NULL,
  assignee_id UUID REFERENCES public.profiles(user_id) ON DELETE SET NULL,
  reporter_id UUID REFERENCES public.profiles(user_id) ON DELETE SET NULL NOT NULL,
  team team_type NOT NULL,
  resolution TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  resolved_at TIMESTAMP WITH TIME ZONE
);

-- Create calls table
CREATE TABLE public.calls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  caller_number TEXT NOT NULL,
  receiver_number TEXT NOT NULL,
  status call_status DEFAULT 'active' NOT NULL,
  duration INTEGER, -- duration in seconds
  recording_url TEXT,
  notes TEXT,
  handled_by UUID REFERENCES public.profiles(user_id) ON DELETE SET NULL,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  ended_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create messages table
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_number TEXT NOT NULL,
  receiver_number TEXT NOT NULL,
  content TEXT NOT NULL,
  status message_status DEFAULT 'sent' NOT NULL,
  message_type TEXT DEFAULT 'text' NOT NULL, -- text, image, document, etc.
  media_url TEXT,
  processed_by UUID REFERENCES public.profiles(user_id) ON DELETE SET NULL,
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  delivered_at TIMESTAMP WITH TIME ZONE,
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view all profiles" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for tasks
CREATE POLICY "Users can view tasks based on role" ON public.tasks
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.user_id = auth.uid() 
      AND (
        p.role = 'developer' OR 
        (p.role = 'manager' AND p.team::text = tasks.team::text) OR
        assignee_id = auth.uid()
      )
    )
  );

CREATE POLICY "Users can insert tasks" ON public.tasks
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.user_id = auth.uid() 
      AND p.role IN ('developer', 'manager')
    )
  );

CREATE POLICY "Users can update tasks based on role" ON public.tasks
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.user_id = auth.uid() 
      AND (
        p.role = 'developer' OR 
        (p.role = 'manager' AND p.team::text = tasks.team::text) OR
        assignee_id = auth.uid()
      )
    )
  );

-- Create RLS policies for tickets
CREATE POLICY "Users can view tickets based on role" ON public.tickets
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.user_id = auth.uid() 
      AND (
        p.role = 'developer' OR 
        (p.role = 'manager' AND p.team::text = tickets.team::text) OR
        assignee_id = auth.uid() OR
        reporter_id = auth.uid()
      )
    )
  );

CREATE POLICY "Users can insert tickets" ON public.tickets
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update tickets based on role" ON public.tickets
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.user_id = auth.uid() 
      AND (
        p.role = 'developer' OR 
        (p.role = 'manager' AND p.team::text = tickets.team::text) OR
        assignee_id = auth.uid()
      )
    )
  );

-- Create RLS policies for calls
CREATE POLICY "Users can view calls based on role" ON public.calls
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.user_id = auth.uid() 
      AND (
        p.role IN ('developer', 'manager') OR
        handled_by = auth.uid()
      )
    )
  );

CREATE POLICY "Users can insert calls" ON public.calls
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update calls" ON public.calls
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.user_id = auth.uid() 
      AND (p.role IN ('developer', 'manager') OR handled_by = auth.uid())
    )
  );

-- Create RLS policies for messages
CREATE POLICY "Users can view messages based on role" ON public.messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.user_id = auth.uid() 
      AND (
        p.role IN ('developer', 'manager') OR
        processed_by = auth.uid()
      )
    )
  );

CREATE POLICY "Users can insert messages" ON public.messages
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update messages" ON public.messages
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles p 
      WHERE p.user_id = auth.uid() 
      AND (p.role IN ('developer', 'manager') OR processed_by = auth.uid())
    )
  );

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, name, email, role, team)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    NEW.email,
    'user',
    'support'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at
  BEFORE UPDATE ON public.tasks
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tickets_updated_at
  BEFORE UPDATE ON public.tickets
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();