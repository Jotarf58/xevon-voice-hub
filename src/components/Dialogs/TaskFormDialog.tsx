import React, { useEffect } from 'react';
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
  description: string | null;
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  assignee_id: string | null;
  created_by: string;
  team: 'technical' | 'support' | 'sales' | 'management';
  category: string;
  due_date: string | null;
  created_at: string;
  updated_at: string;
  archived: boolean;
}

interface TaskFormData {
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  team: 'technical' | 'support' | 'sales' | 'management';
  category: string;
  due_date: string;
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
      description: task.description || '',
      status: task.status,
      priority: task.priority,
      team: task.team,
      category: task.category,
      due_date: task.due_date ? task.due_date.split('T')[0] : ''
    } : {
      title: '',
      description: '',
      status: 'pending' as const,
      priority: 'medium' as const,
      team: (user?.team as 'technical' | 'support' | 'sales' | 'management') || 'support',
      category: '',
      due_date: ''
    }
  });

  const status = watch('status');
  const priority = watch('priority');
  const team = watch('team');
  const category = watch('category');

  // Reset form when task changes
  useEffect(() => {
    if (task) {
      reset({
        title: task.title,
        description: task.description || '',
        status: task.status,
        priority: task.priority,
        team: task.team,
        category: task.category,
        due_date: task.due_date ? task.due_date.split('T')[0] : ''
      });
    } else {
      reset({
        title: '',
        description: '',
        status: 'pending' as const,
        priority: 'medium' as const,
        team: (user?.team as 'technical' | 'support' | 'sales' | 'management') || 'support',
        category: '',
        due_date: ''
      });
    }
  }, [task, reset, user?.team]);

  const onSubmit = (data: TaskFormData) => {
    onSave(data);
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
              <Label htmlFor="team">Equipa</Label>
              <Select value={team} onValueChange={(value) => setValue('team', value as any)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a equipa" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="technical">Technical</SelectItem>
                  <SelectItem value="support">Support</SelectItem>
                  <SelectItem value="sales">Sales</SelectItem>
                  <SelectItem value="management">Management</SelectItem>
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
              <Label htmlFor="due_date">Data de Vencimento</Label>
              <Input
                id="due_date"
                type="date"
                {...register('due_date', { required: true })}
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