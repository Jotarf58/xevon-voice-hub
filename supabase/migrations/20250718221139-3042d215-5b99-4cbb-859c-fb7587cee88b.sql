-- Criar índices otimizados para consultas de tarefas prioritárias
CREATE INDEX IF NOT EXISTS idx_tasks_priority_archived_created_at 
ON public.tasks (priority, archived, created_at DESC);

-- Índice adicional para consultas por status e prioridade
CREATE INDEX IF NOT EXISTS idx_tasks_status_priority_archived 
ON public.tasks (status, priority, archived);

-- Índice para consultas por assignee_id com filtros
CREATE INDEX IF NOT EXISTS idx_tasks_assignee_priority_archived 
ON public.tasks (assignee_id, priority, archived) 
WHERE archived = false;