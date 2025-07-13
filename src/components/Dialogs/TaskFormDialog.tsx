import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/contexts/AuthContext';

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  assignee: string;
  team: string;
  category: string;
  dueDate: string;
  createdBy: string;
  n8nWorkflow?: string;
}

interface TaskFormData {
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  assignee: string;
  team: string;
  category: string;
  dueDate: string;
  n8nWorkflow: string;
}

interface TaskFormDialogProps {
  task?: Task;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (task: TaskFormData) => void;
}

export const TaskFormDialog: React.FC<TaskFormDialogProps> = ({
  task,
  open,
  onOpenChange,
  onSave
}) => {
  const { user } = useAuth();
  const { register, handleSubmit, setValue, watch, reset } = useForm<TaskFormData>({
    defaultValues: task ? {
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      assignee: task.assignee,
      team: task.team,
      category: task.category,
      dueDate: task.dueDate,
      n8nWorkflow: task.n8nWorkflow || ''
    } : {
      title: '',
      description: '',
      status: 'pending',
      priority: 'medium',
      assignee: '',
      team: user?.team || '',
      category: '',
      dueDate: '',
      n8nWorkflow: ''
    }
  });

  const status = watch('status');
  const priority = watch('priority');
  const team = watch('team');
  const category = watch('category');

  const onSubmit = (data: TaskFormData) => {
    onSave(data);
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {task ? 'Editar Tarefa' : 'Nova Tarefa'}
          </DialogTitle>
          <DialogDescription>
            {task ? 'Modifique os campos necessários' : 'Preencha os dados da nova tarefa'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label htmlFor="title">Título</Label>
              <Input
                id="title"
                {...register('title', { required: true })}
                placeholder="Digite o título da tarefa"
              />
            </div>

            <div className="col-span-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                {...register('description', { required: true })}
                placeholder="Descreva a tarefa em detalhes"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={status} onValueChange={(value) => setValue('status', value as any)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pendente</SelectItem>
                  <SelectItem value="in_progress">Em Progresso</SelectItem>
                  <SelectItem value="completed">Concluída</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="priority">Prioridade</Label>
              <Select value={priority} onValueChange={(value) => setValue('priority', value as any)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a prioridade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Baixa</SelectItem>
                  <SelectItem value="medium">Média</SelectItem>
                  <SelectItem value="high">Alta</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="assignee">Responsável</Label>
              <Input
                id="assignee"
                {...register('assignee', { required: true })}
                placeholder="Nome do responsável"
              />
            </div>

            <div>
              <Label htmlFor="team">Equipa</Label>
              <Select value={team} onValueChange={(value) => setValue('team', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a equipa" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Technical">Technical</SelectItem>
                  <SelectItem value="Support">Support</SelectItem>
                  <SelectItem value="Sales">Sales</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="category">Categoria</Label>
              <Select value={category} onValueChange={(value) => setValue('category', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Integration">Integração</SelectItem>
                  <SelectItem value="Content">Conteúdo</SelectItem>
                  <SelectItem value="Analytics">Analytics</SelectItem>
                  <SelectItem value="Support">Suporte</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="dueDate">Data de Vencimento</Label>
              <Input
                id="dueDate"
                type="date"
                {...register('dueDate', { required: true })}
              />
            </div>

            <div className="col-span-2">
              <Label htmlFor="n8nWorkflow">Workflow n8n (opcional)</Label>
              <Input
                id="n8nWorkflow"
                {...register('n8nWorkflow')}
                placeholder="Nome do workflow n8n"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-gradient-primary hover:bg-gradient-primary/90">
              {task ? 'Actualizar' : 'Criar Tarefa'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};