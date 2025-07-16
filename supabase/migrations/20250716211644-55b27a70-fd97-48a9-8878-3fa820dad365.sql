-- Add archived field to tasks table
ALTER TABLE public.tasks ADD COLUMN archived boolean NOT NULL DEFAULT false;

-- Create index for archived tasks
CREATE INDEX idx_tasks_archived ON public.tasks(archived);

-- Update RLS policies to handle archived tasks
CREATE POLICY "Users can view archived tasks based on role" 
ON public.tasks 
FOR SELECT 
USING (
  archived = true AND 
  EXISTS (
    SELECT 1 FROM profiles p 
    WHERE p.user_id = auth.uid() 
    AND (
      p.role = 'developer'::user_role 
      OR (p.role = 'manager'::user_role AND p.team::text = tasks.team::text) 
      OR tasks.assignee_id = auth.uid()
    )
  )
);

-- Update existing policy to exclude archived tasks from main view
DROP POLICY "Users can view tasks based on role" ON public.tasks;

CREATE POLICY "Users can view non-archived tasks based on role" 
ON public.tasks 
FOR SELECT 
USING (
  archived = false AND 
  EXISTS (
    SELECT 1 FROM profiles p 
    WHERE p.user_id = auth.uid() 
    AND (
      p.role = 'developer'::user_role 
      OR (p.role = 'manager'::user_role AND p.team::text = tasks.team::text) 
      OR tasks.assignee_id = auth.uid()
    )
  )
);