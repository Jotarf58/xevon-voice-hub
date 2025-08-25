-- First, add missing foreign key relationships and security improvements

-- 1. Add user_id column to supabase_users to link with auth.users
ALTER TABLE public.supabase_users 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- 2. Add foreign key constraints for supabase_users
ALTER TABLE public.supabase_users
ADD CONSTRAINT fk_supabase_users_role 
FOREIGN KEY (id_role) REFERENCES public.supabase_roles(id_role);

ALTER TABLE public.supabase_users
ADD CONSTRAINT fk_supabase_users_organization 
FOREIGN KEY (id_organization) REFERENCES public.organization(id_organization);

-- 3. Add unique constraint on user_id to prevent duplicate entries
ALTER TABLE public.supabase_users
ADD CONSTRAINT unique_supabase_users_user_id UNIQUE (user_id);

-- 4. Add organization scoping to sensitive tables (add id_organization where missing)
ALTER TABLE public.call_history 
ADD COLUMN IF NOT EXISTS id_organization BIGINT REFERENCES public.organization(id_organization);

ALTER TABLE public.message_history 
ADD COLUMN IF NOT EXISTS id_organization BIGINT REFERENCES public.organization(id_organization);

ALTER TABLE public.callers 
ADD COLUMN IF NOT EXISTS id_organization BIGINT REFERENCES public.organization(id_organization);

ALTER TABLE public.tasks 
ADD COLUMN IF NOT EXISTS id_organization BIGINT REFERENCES public.organization(id_organization);

ALTER TABLE public.budgets 
ADD COLUMN IF NOT EXISTS id_organization BIGINT REFERENCES public.organization(id_organization);

ALTER TABLE public.calendar_events 
ADD COLUMN IF NOT EXISTS id_organization BIGINT REFERENCES public.organization(id_organization);

ALTER TABLE public.tickets 
ADD COLUMN IF NOT EXISTS id_organization BIGINT REFERENCES public.organization(id_organization);

-- Archive tables
ALTER TABLE public.call_archive 
ADD COLUMN IF NOT EXISTS id_organization BIGINT REFERENCES public.organization(id_organization);

ALTER TABLE public.message_archive 
ADD COLUMN IF NOT EXISTS id_organization BIGINT REFERENCES public.organization(id_organization);

ALTER TABLE public.task_archive 
ADD COLUMN IF NOT EXISTS id_organization BIGINT REFERENCES public.organization(id_organization);

ALTER TABLE public.ticket_archive 
ADD COLUMN IF NOT EXISTS id_organization BIGINT REFERENCES public.organization(id_organization);

-- 5. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_call_history_organization ON public.call_history(id_organization);
CREATE INDEX IF NOT EXISTS idx_message_history_organization ON public.message_history(id_organization);
CREATE INDEX IF NOT EXISTS idx_callers_organization ON public.callers(id_organization);
CREATE INDEX IF NOT EXISTS idx_tasks_organization ON public.tasks(id_organization);
CREATE INDEX IF NOT EXISTS idx_budgets_organization ON public.budgets(id_organization);
CREATE INDEX IF NOT EXISTS idx_calendar_events_organization ON public.calendar_events(id_organization);
CREATE INDEX IF NOT EXISTS idx_tickets_organization ON public.tickets(id_organization);

-- 6. Create security definer helper functions to avoid RLS recursion
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role TEXT)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.supabase_users su
    JOIN public.supabase_roles sr ON su.id_role = sr.id_role
    WHERE su.user_id = _user_id
      AND sr.name = _role
  );
$$;

CREATE OR REPLACE FUNCTION public.user_organization_ids(_user_id UUID)
RETURNS SETOF BIGINT
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT su.id_organization
  FROM public.supabase_users su
  WHERE su.user_id = _user_id
    AND su.id_organization IS NOT NULL;
$$;

CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT sr.name
  FROM public.supabase_users su
  JOIN public.supabase_roles sr ON su.id_role = sr.id_role
  WHERE su.user_id = auth.uid()
  LIMIT 1;
$$;

-- 7. Enable RLS on all tables
ALTER TABLE public.supabase_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.supabase_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.call_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.callers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calendar_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.call_archive ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_archive ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_archive ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ticket_archive ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tmodules_torganization ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.supabase_credentials ENABLE ROW LEVEL SECURITY;

-- 8. Create RLS policies for supabase_users
CREATE POLICY "Users can view their own profile"
ON public.supabase_users
FOR SELECT
TO authenticated
USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'XEVON') OR public.has_role(auth.uid(), 'Admin'));

CREATE POLICY "Only admins can insert users"
ON public.supabase_users
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'XEVON') OR public.has_role(auth.uid(), 'Admin'));

CREATE POLICY "Only admins can update users"
ON public.supabase_users
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'XEVON') OR public.has_role(auth.uid(), 'Admin'));

CREATE POLICY "Only admins can delete users"
ON public.supabase_users
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'XEVON') OR public.has_role(auth.uid(), 'Admin'));

-- 9. Create RLS policies for organization
CREATE POLICY "Users can view their organization"
ON public.organization
FOR SELECT
TO authenticated
USING (
  id_organization IN (SELECT public.user_organization_ids(auth.uid())) 
  OR public.has_role(auth.uid(), 'XEVON') 
  OR public.has_role(auth.uid(), 'Admin')
);

CREATE POLICY "Only admins can modify organizations"
ON public.organization
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'XEVON') OR public.has_role(auth.uid(), 'Admin'))
WITH CHECK (public.has_role(auth.uid(), 'XEVON') OR public.has_role(auth.uid(), 'Admin'));

-- 10. Create RLS policies for sensitive data tables (organization-scoped)
-- Call history
CREATE POLICY "Users can access call history from their organization"
ON public.call_history
FOR ALL
TO authenticated
USING (
  id_organization IN (SELECT public.user_organization_ids(auth.uid()))
  OR public.has_role(auth.uid(), 'XEVON')
  OR public.has_role(auth.uid(), 'Admin')
)
WITH CHECK (
  id_organization IN (SELECT public.user_organization_ids(auth.uid()))
  OR public.has_role(auth.uid(), 'XEVON')
  OR public.has_role(auth.uid(), 'Admin')
);

-- Message history
CREATE POLICY "Users can access message history from their organization"
ON public.message_history
FOR ALL
TO authenticated
USING (
  id_organization IN (SELECT public.user_organization_ids(auth.uid()))
  OR public.has_role(auth.uid(), 'XEVON')
  OR public.has_role(auth.uid(), 'Admin')
)
WITH CHECK (
  id_organization IN (SELECT public.user_organization_ids(auth.uid()))
  OR public.has_role(auth.uid(), 'XEVON')
  OR public.has_role(auth.uid(), 'Admin')
);

-- Tasks
CREATE POLICY "Users can access tasks from their organization"
ON public.tasks
FOR ALL
TO authenticated
USING (
  id_organization IN (SELECT public.user_organization_ids(auth.uid()))
  OR public.has_role(auth.uid(), 'XEVON')
  OR public.has_role(auth.uid(), 'Admin')
)
WITH CHECK (
  id_organization IN (SELECT public.user_organization_ids(auth.uid()))
  OR public.has_role(auth.uid(), 'XEVON')
  OR public.has_role(auth.uid(), 'Admin')
);

-- Budgets
CREATE POLICY "Users can access budgets from their organization"
ON public.budgets
FOR ALL
TO authenticated
USING (
  id_organization IN (SELECT public.user_organization_ids(auth.uid()))
  OR public.has_role(auth.uid(), 'XEVON')
  OR public.has_role(auth.uid(), 'Admin')
)
WITH CHECK (
  id_organization IN (SELECT public.user_organization_ids(auth.uid()))
  OR public.has_role(auth.uid(), 'XEVON')
  OR public.has_role(auth.uid(), 'Admin')
);

-- Calendar events
CREATE POLICY "Users can access calendar events from their organization"
ON public.calendar_events
FOR ALL
TO authenticated
USING (
  id_organization IN (SELECT public.user_organization_ids(auth.uid()))
  OR public.has_role(auth.uid(), 'XEVON')
  OR public.has_role(auth.uid(), 'Admin')
)
WITH CHECK (
  id_organization IN (SELECT public.user_organization_ids(auth.uid()))
  OR public.has_role(auth.uid(), 'XEVON')
  OR public.has_role(auth.uid(), 'Admin')
);

-- Tickets
CREATE POLICY "Users can access tickets from their organization"
ON public.tickets
FOR ALL
TO authenticated
USING (
  id_organization IN (SELECT public.user_organization_ids(auth.uid()))
  OR public.has_role(auth.uid(), 'XEVON')
  OR public.has_role(auth.uid(), 'Admin')
)
WITH CHECK (
  id_organization IN (SELECT public.user_organization_ids(auth.uid()))
  OR public.has_role(auth.uid(), 'XEVON')
  OR public.has_role(auth.uid(), 'Admin')
);

-- Callers
CREATE POLICY "Users can access callers from their organization"
ON public.callers
FOR ALL
TO authenticated
USING (
  id_organization IN (SELECT public.user_organization_ids(auth.uid()))
  OR public.has_role(auth.uid(), 'XEVON')
  OR public.has_role(auth.uid(), 'Admin')
)
WITH CHECK (
  id_organization IN (SELECT public.user_organization_ids(auth.uid()))
  OR public.has_role(auth.uid(), 'XEVON')
  OR public.has_role(auth.uid(), 'Admin')
);

-- 11. Secure supabase_credentials (highly sensitive)
CREATE POLICY "Only XEVON can access credentials"
ON public.supabase_credentials
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'XEVON'))
WITH CHECK (public.has_role(auth.uid(), 'XEVON'));

-- 12. Secure modules access
CREATE POLICY "Users can view modules related to their organization"
ON public.modules
FOR SELECT
TO authenticated
USING (
  id_module IN (
    SELECT tm.id_module 
    FROM public.tmodules_torganization tm
    WHERE tm.id_organization IN (SELECT public.user_organization_ids(auth.uid()))
  )
  OR public.has_role(auth.uid(), 'XEVON')
  OR public.has_role(auth.uid(), 'Admin')
);

CREATE POLICY "Only admins can modify modules"
ON public.modules
FOR INSERT, UPDATE, DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'XEVON') OR public.has_role(auth.uid(), 'Admin'))
WITH CHECK (public.has_role(auth.uid(), 'XEVON') OR public.has_role(auth.uid(), 'Admin'));

-- 13. Secure module-organization relationships
CREATE POLICY "Users can view their organization's module relationships"
ON public.tmodules_torganization
FOR SELECT
TO authenticated
USING (
  id_organization IN (SELECT public.user_organization_ids(auth.uid()))
  OR public.has_role(auth.uid(), 'XEVON')
  OR public.has_role(auth.uid(), 'Admin')
);

CREATE POLICY "Only admins can modify module relationships"
ON public.tmodules_torganization
FOR INSERT, UPDATE, DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'XEVON') OR public.has_role(auth.uid(), 'Admin'))
WITH CHECK (public.has_role(auth.uid(), 'XEVON') OR public.has_role(auth.uid(), 'Admin'));

-- 14. Secure roles table
CREATE POLICY "Users can view roles"
ON public.supabase_roles
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Only XEVON can modify roles"
ON public.supabase_roles
FOR INSERT, UPDATE, DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'XEVON'))
WITH CHECK (public.has_role(auth.uid(), 'XEVON'));