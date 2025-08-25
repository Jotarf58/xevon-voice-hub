-- Add RLS policies for all tables

-- Fix security definer functions with proper search_path
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role TEXT)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
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
SET search_path = public
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
SET search_path = public
AS $$
  SELECT sr.name
  FROM public.supabase_users su
  JOIN public.supabase_roles sr ON su.id_role = sr.id_role
  WHERE su.user_id = auth.uid()
  LIMIT 1;
$$;

-- RLS policies for supabase_users
DROP POLICY IF EXISTS "Users can view their own profile" ON public.supabase_users;
CREATE POLICY "Users can view their own profile"
ON public.supabase_users
FOR SELECT
TO authenticated
USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'XEVON') OR public.has_role(auth.uid(), 'Admin'));

DROP POLICY IF EXISTS "Only admins can insert users" ON public.supabase_users;
CREATE POLICY "Only admins can insert users"
ON public.supabase_users
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'XEVON') OR public.has_role(auth.uid(), 'Admin'));

DROP POLICY IF EXISTS "Only admins can update users" ON public.supabase_users;
CREATE POLICY "Only admins can update users"
ON public.supabase_users
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'XEVON') OR public.has_role(auth.uid(), 'Admin'));

DROP POLICY IF EXISTS "Only admins can delete users" ON public.supabase_users;
CREATE POLICY "Only admins can delete users"
ON public.supabase_users
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'XEVON') OR public.has_role(auth.uid(), 'Admin'));

-- RLS policies for organization
DROP POLICY IF EXISTS "Users can view their organization" ON public.organization;
CREATE POLICY "Users can view their organization"
ON public.organization
FOR SELECT
TO authenticated
USING (
  id_organization IN (SELECT public.user_organization_ids(auth.uid())) 
  OR public.has_role(auth.uid(), 'XEVON') 
  OR public.has_role(auth.uid(), 'Admin')
);

DROP POLICY IF EXISTS "Only admins can modify organizations" ON public.organization;
CREATE POLICY "Only admins can insert organizations"
ON public.organization
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'XEVON') OR public.has_role(auth.uid(), 'Admin'));

CREATE POLICY "Only admins can update organizations"
ON public.organization
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'XEVON') OR public.has_role(auth.uid(), 'Admin'));

CREATE POLICY "Only admins can delete organizations"
ON public.organization
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'XEVON') OR public.has_role(auth.uid(), 'Admin'));

-- RLS policies for call_history
DROP POLICY IF EXISTS "Users can access call history from their organization" ON public.call_history;
CREATE POLICY "Users can access call history from their organization"
ON public.call_history
FOR SELECT
TO authenticated
USING (
  id_organization IN (SELECT public.user_organization_ids(auth.uid()))
  OR public.has_role(auth.uid(), 'XEVON')
  OR public.has_role(auth.uid(), 'Admin')
);

CREATE POLICY "Users can insert call history for their organization"
ON public.call_history
FOR INSERT
TO authenticated
WITH CHECK (
  id_organization IN (SELECT public.user_organization_ids(auth.uid()))
  OR public.has_role(auth.uid(), 'XEVON')
  OR public.has_role(auth.uid(), 'Admin')
);

CREATE POLICY "Users can update call history for their organization"
ON public.call_history
FOR UPDATE
TO authenticated
USING (
  id_organization IN (SELECT public.user_organization_ids(auth.uid()))
  OR public.has_role(auth.uid(), 'XEVON')
  OR public.has_role(auth.uid(), 'Admin')
);

CREATE POLICY "Users can delete call history for their organization"
ON public.call_history
FOR DELETE
TO authenticated
USING (
  id_organization IN (SELECT public.user_organization_ids(auth.uid()))
  OR public.has_role(auth.uid(), 'XEVON')
  OR public.has_role(auth.uid(), 'Admin')
);

-- RLS policies for message_history
CREATE POLICY "Users can access message history from their organization"
ON public.message_history
FOR SELECT
TO authenticated
USING (
  id_organization IN (SELECT public.user_organization_ids(auth.uid()))
  OR public.has_role(auth.uid(), 'XEVON')
  OR public.has_role(auth.uid(), 'Admin')
);

CREATE POLICY "Users can insert message history for their organization"
ON public.message_history
FOR INSERT
TO authenticated
WITH CHECK (
  id_organization IN (SELECT public.user_organization_ids(auth.uid()))
  OR public.has_role(auth.uid(), 'XEVON')
  OR public.has_role(auth.uid(), 'Admin')
);

CREATE POLICY "Users can update message history for their organization"
ON public.message_history
FOR UPDATE
TO authenticated
USING (
  id_organization IN (SELECT public.user_organization_ids(auth.uid()))
  OR public.has_role(auth.uid(), 'XEVON')
  OR public.has_role(auth.uid(), 'Admin')
);

CREATE POLICY "Users can delete message history for their organization"
ON public.message_history
FOR DELETE
TO authenticated
USING (
  id_organization IN (SELECT public.user_organization_ids(auth.uid()))
  OR public.has_role(auth.uid(), 'XEVON')
  OR public.has_role(auth.uid(), 'Admin')
);

-- RLS policies for tasks
CREATE POLICY "Users can access tasks from their organization"
ON public.tasks
FOR SELECT
TO authenticated
USING (
  id_organization IN (SELECT public.user_organization_ids(auth.uid()))
  OR public.has_role(auth.uid(), 'XEVON')
  OR public.has_role(auth.uid(), 'Admin')
);

CREATE POLICY "Users can insert tasks for their organization"
ON public.tasks
FOR INSERT
TO authenticated
WITH CHECK (
  id_organization IN (SELECT public.user_organization_ids(auth.uid()))
  OR public.has_role(auth.uid(), 'XEVON')
  OR public.has_role(auth.uid(), 'Admin')
);

CREATE POLICY "Users can update tasks for their organization"
ON public.tasks
FOR UPDATE
TO authenticated
USING (
  id_organization IN (SELECT public.user_organization_ids(auth.uid()))
  OR public.has_role(auth.uid(), 'XEVON')
  OR public.has_role(auth.uid(), 'Admin')
);

CREATE POLICY "Users can delete tasks for their organization"
ON public.tasks
FOR DELETE
TO authenticated
USING (
  id_organization IN (SELECT public.user_organization_ids(auth.uid()))
  OR public.has_role(auth.uid(), 'XEVON')
  OR public.has_role(auth.uid(), 'Admin')
);

-- RLS policies for budgets
CREATE POLICY "Users can access budgets from their organization"
ON public.budgets
FOR SELECT
TO authenticated
USING (
  id_organization IN (SELECT public.user_organization_ids(auth.uid()))
  OR public.has_role(auth.uid(), 'XEVON')
  OR public.has_role(auth.uid(), 'Admin')
);

CREATE POLICY "Users can insert budgets for their organization"
ON public.budgets
FOR INSERT
TO authenticated
WITH CHECK (
  id_organization IN (SELECT public.user_organization_ids(auth.uid()))
  OR public.has_role(auth.uid(), 'XEVON')
  OR public.has_role(auth.uid(), 'Admin')
);

CREATE POLICY "Users can update budgets for their organization"
ON public.budgets
FOR UPDATE
TO authenticated
USING (
  id_organization IN (SELECT public.user_organization_ids(auth.uid()))
  OR public.has_role(auth.uid(), 'XEVON')
  OR public.has_role(auth.uid(), 'Admin')
);

CREATE POLICY "Users can delete budgets for their organization"
ON public.budgets
FOR DELETE
TO authenticated
USING (
  id_organization IN (SELECT public.user_organization_ids(auth.uid()))
  OR public.has_role(auth.uid(), 'XEVON')
  OR public.has_role(auth.uid(), 'Admin')
);

-- RLS policies for calendar_events
CREATE POLICY "Users can access calendar events from their organization"
ON public.calendar_events
FOR SELECT
TO authenticated
USING (
  id_organization IN (SELECT public.user_organization_ids(auth.uid()))
  OR public.has_role(auth.uid(), 'XEVON')
  OR public.has_role(auth.uid(), 'Admin')
);

CREATE POLICY "Users can insert calendar events for their organization"
ON public.calendar_events
FOR INSERT
TO authenticated
WITH CHECK (
  id_organization IN (SELECT public.user_organization_ids(auth.uid()))
  OR public.has_role(auth.uid(), 'XEVON')
  OR public.has_role(auth.uid(), 'Admin')
);

CREATE POLICY "Users can update calendar events for their organization"
ON public.calendar_events
FOR UPDATE
TO authenticated
USING (
  id_organization IN (SELECT public.user_organization_ids(auth.uid()))
  OR public.has_role(auth.uid(), 'XEVON')
  OR public.has_role(auth.uid(), 'Admin')
);

CREATE POLICY "Users can delete calendar events for their organization"
ON public.calendar_events
FOR DELETE
TO authenticated
USING (
  id_organization IN (SELECT public.user_organization_ids(auth.uid()))
  OR public.has_role(auth.uid(), 'XEVON')
  OR public.has_role(auth.uid(), 'Admin')
);

-- RLS policies for tickets
CREATE POLICY "Users can access tickets from their organization"
ON public.tickets
FOR SELECT
TO authenticated
USING (
  id_organization IN (SELECT public.user_organization_ids(auth.uid()))
  OR public.has_role(auth.uid(), 'XEVON')
  OR public.has_role(auth.uid(), 'Admin')
);

CREATE POLICY "Users can insert tickets for their organization"
ON public.tickets
FOR INSERT
TO authenticated
WITH CHECK (
  id_organization IN (SELECT public.user_organization_ids(auth.uid()))
  OR public.has_role(auth.uid(), 'XEVON')
  OR public.has_role(auth.uid(), 'Admin')
);

CREATE POLICY "Users can update tickets for their organization"
ON public.tickets
FOR UPDATE
TO authenticated
USING (
  id_organization IN (SELECT public.user_organization_ids(auth.uid()))
  OR public.has_role(auth.uid(), 'XEVON')
  OR public.has_role(auth.uid(), 'Admin')
);

CREATE POLICY "Users can delete tickets for their organization"
ON public.tickets
FOR DELETE
TO authenticated
USING (
  id_organization IN (SELECT public.user_organization_ids(auth.uid()))
  OR public.has_role(auth.uid(), 'XEVON')
  OR public.has_role(auth.uid(), 'Admin')
);

-- RLS policies for callers
CREATE POLICY "Users can access callers from their organization"
ON public.callers
FOR SELECT
TO authenticated
USING (
  id_organization IN (SELECT public.user_organization_ids(auth.uid()))
  OR public.has_role(auth.uid(), 'XEVON')
  OR public.has_role(auth.uid(), 'Admin')
);

CREATE POLICY "Users can insert callers for their organization"
ON public.callers
FOR INSERT
TO authenticated
WITH CHECK (
  id_organization IN (SELECT public.user_organization_ids(auth.uid()))
  OR public.has_role(auth.uid(), 'XEVON')
  OR public.has_role(auth.uid(), 'Admin')
);

CREATE POLICY "Users can update callers for their organization"
ON public.callers
FOR UPDATE
TO authenticated
USING (
  id_organization IN (SELECT public.user_organization_ids(auth.uid()))
  OR public.has_role(auth.uid(), 'XEVON')
  OR public.has_role(auth.uid(), 'Admin')
);

CREATE POLICY "Users can delete callers for their organization"
ON public.callers
FOR DELETE
TO authenticated
USING (
  id_organization IN (SELECT public.user_organization_ids(auth.uid()))
  OR public.has_role(auth.uid(), 'XEVON')
  OR public.has_role(auth.uid(), 'Admin')
);

-- RLS policies for supabase_credentials (highly sensitive)
CREATE POLICY "Only XEVON can access credentials"
ON public.supabase_credentials
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'XEVON'))
WITH CHECK (public.has_role(auth.uid(), 'XEVON'));

-- RLS policies for modules
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

CREATE POLICY "Only admins can insert modules"
ON public.modules
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'XEVON') OR public.has_role(auth.uid(), 'Admin'));

CREATE POLICY "Only admins can update modules"
ON public.modules
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'XEVON') OR public.has_role(auth.uid(), 'Admin'));

CREATE POLICY "Only admins can delete modules"
ON public.modules
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'XEVON') OR public.has_role(auth.uid(), 'Admin'));

-- RLS policies for tmodules_torganization
CREATE POLICY "Users can view their organization's module relationships"
ON public.tmodules_torganization
FOR SELECT
TO authenticated
USING (
  id_organization IN (SELECT public.user_organization_ids(auth.uid()))
  OR public.has_role(auth.uid(), 'XEVON')
  OR public.has_role(auth.uid(), 'Admin')
);

CREATE POLICY "Only admins can insert module relationships"
ON public.tmodules_torganization
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'XEVON') OR public.has_role(auth.uid(), 'Admin'));

CREATE POLICY "Only admins can update module relationships"
ON public.tmodules_torganization
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'XEVON') OR public.has_role(auth.uid(), 'Admin'));

CREATE POLICY "Only admins can delete module relationships"
ON public.tmodules_torganization
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'XEVON') OR public.has_role(auth.uid(), 'Admin'));

-- RLS policies for supabase_roles
CREATE POLICY "Users can view roles"
ON public.supabase_roles
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Only XEVON can insert roles"
ON public.supabase_roles
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'XEVON'));

CREATE POLICY "Only XEVON can update roles"
ON public.supabase_roles
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'XEVON'));

CREATE POLICY "Only XEVON can delete roles"
ON public.supabase_roles
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'XEVON'));