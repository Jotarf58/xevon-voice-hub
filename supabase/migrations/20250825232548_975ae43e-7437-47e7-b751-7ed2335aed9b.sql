-- Fix typo in ticket_archive policy and add any missing policies

-- Fix typo in ticket_archive delete policy 
DROP POLICY IF EXISTS "Users can delete ticket archive for their organization" ON public.ticket_archive;
CREATE POLICY "Users can delete ticket archive for their organization"
ON public.ticket_archive
FOR DELETE
TO authenticated
USING (
  id_organization IN (SELECT public.user_organization_ids(auth.uid()))
  OR public.has_role(auth.uid(), 'XEVON')
  OR public.has_role(auth.uid(), 'Admin')
);

-- Add missing policies for tmodules_ttables (system table)
ALTER TABLE public.tmodules_ttables ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only admins can access module-table relationships"
ON public.tmodules_ttables
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'XEVON') OR public.has_role(auth.uid(), 'Admin'))
WITH CHECK (public.has_role(auth.uid(), 'XEVON') OR public.has_role(auth.uid(), 'Admin'));