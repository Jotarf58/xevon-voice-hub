-- Fix security issues found in database

-- Add RLS policies for documents table
CREATE POLICY "Users can access documents from their organization"
ON public.documents
FOR SELECT
USING ((id_organization IN (SELECT user_organization_ids(auth.uid()))) OR has_role(auth.uid(), 'XEVON') OR has_role(auth.uid(), 'Admin'));

CREATE POLICY "Users can insert documents for their organization"
ON public.documents
FOR INSERT
WITH CHECK ((id_organization IN (SELECT user_organization_ids(auth.uid()))) OR has_role(auth.uid(), 'XEVON') OR has_role(auth.uid(), 'Admin'));

CREATE POLICY "Users can update documents for their organization"
ON public.documents
FOR UPDATE
USING ((id_organization IN (SELECT user_organization_ids(auth.uid()))) OR has_role(auth.uid(), 'XEVON') OR has_role(auth.uid(), 'Admin'));

CREATE POLICY "Users can delete documents for their organization"
ON public.documents
FOR DELETE
USING ((id_organization IN (SELECT user_organization_ids(auth.uid()))) OR has_role(auth.uid(), 'XEVON') OR has_role(auth.uid(), 'Admin'));

-- Add RLS policies for documents_agent table
CREATE POLICY "Users can access agent documents from their organization"
ON public.documents_agent
FOR SELECT
USING ((id_organization IN (SELECT user_organization_ids(auth.uid()))) OR has_role(auth.uid(), 'XEVON') OR has_role(auth.uid(), 'Admin'));

CREATE POLICY "Users can insert agent documents for their organization"
ON public.documents_agent
FOR INSERT
WITH CHECK ((id_organization IN (SELECT user_organization_ids(auth.uid()))) OR has_role(auth.uid(), 'XEVON') OR has_role(auth.uid(), 'Admin'));

CREATE POLICY "Users can update agent documents for their organization"
ON public.documents_agent
FOR UPDATE
USING ((id_organization IN (SELECT user_organization_ids(auth.uid()))) OR has_role(auth.uid(), 'XEVON') OR has_role(auth.uid(), 'Admin'));

CREATE POLICY "Users can delete agent documents for their organization"
ON public.documents_agent
FOR DELETE
USING ((id_organization IN (SELECT user_organization_ids(auth.uid()))) OR has_role(auth.uid(), 'XEVON') OR has_role(auth.uid(), 'Admin'));