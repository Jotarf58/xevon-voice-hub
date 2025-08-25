-- Security fixes migration (corrected)

-- 1. Add user_id column to supabase_users to link with auth.users
ALTER TABLE public.supabase_users 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- 2. Add foreign key constraints for supabase_users
ALTER TABLE public.supabase_users
DROP CONSTRAINT IF EXISTS fk_supabase_users_role;
ALTER TABLE public.supabase_users
ADD CONSTRAINT fk_supabase_users_role 
FOREIGN KEY (id_role) REFERENCES public.supabase_roles(id_role);

ALTER TABLE public.supabase_users
DROP CONSTRAINT IF EXISTS fk_supabase_users_organization;
ALTER TABLE public.supabase_users
ADD CONSTRAINT fk_supabase_users_organization 
FOREIGN KEY (id_organization) REFERENCES public.organization(id_organization);

-- 3. Add unique constraint on user_id
ALTER TABLE public.supabase_users
DROP CONSTRAINT IF EXISTS unique_supabase_users_user_id;
ALTER TABLE public.supabase_users
ADD CONSTRAINT unique_supabase_users_user_id UNIQUE (user_id);

-- 4. Add organization scoping to sensitive tables
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

-- 6. Create security definer helper functions
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
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tmodules_torganization ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.supabase_credentials ENABLE ROW LEVEL SECURITY;