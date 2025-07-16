import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/contexts/AuthContext';

interface TicketType {
  id: string;
  title: string;
  description: string | null;
  type: 'bug' | 'feature_request' | 'support' | 'integration' | 'configuration';
  status: 'open' | 'in_progress' | 'proposed_solution' | 'closed';
  priority: 'low' | 'medium' | 'high';
  assignee_id: string | null;
  reporter_id: string;
  team: 'technical' | 'support' | 'sales' | 'management';
  resolution: string | null;
  resolved_at: string | null;
  created_at: string;
  updated_at: string;
}

interface TicketFormData {
  title: string;
  description: string;
  type: 'bug' | 'feature_request' | 'support' | 'integration' | 'configuration';
  status: 'open' | 'in_progress' | 'proposed_solution' | 'closed';
  priority: 'low' | 'medium' | 'high';
  team: 'technical' | 'support' | 'sales' | 'management';
}

interface TicketFormDialogProps {
  ticket?: TicketType;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (ticket: TicketFormData) => void;
}

export const TicketFormDialog: React.FC<TicketFormDialogProps> = ({
  ticket,
  open,
  onOpenChange,
  onSave
}) => {
  const { user } = useAuth();
  const { register, handleSubmit, setValue, watch, reset } = useForm<TicketFormData>({
    defaultValues: ticket ? {
      title: ticket.title,
      description: ticket.description || '',
      type: ticket.type,
      status: ticket.status,
      priority: ticket.priority,
      team: ticket.team
    } : {
      title: '',
      description: '',
      type: 'support' as const,
      status: 'open' as const,
      priority: 'medium' as const,
      team: (user?.team as 'technical' | 'support' | 'sales' | 'management') || 'support'
    }
  });

  const status = watch('status');
  const priority = watch('priority');
  const team = watch('team');
  const type = watch('type');

  const onSubmit = (data: TicketFormData) => {
    onSave(data);
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {ticket ? 'Editar Ticket' : 'Novo Ticket'}
          </DialogTitle>
          <DialogDescription>
            {ticket ? 'Modifique os campos necessários' : 'Preencha os dados do novo ticket'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label htmlFor="title">Título</Label>
              <Input
                id="title"
                {...register('title', { required: true })}
                placeholder="Digite o título do ticket"
              />
            </div>

            <div className="col-span-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                {...register('description', { required: true })}
                placeholder="Descreva o problema em detalhes"
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
                  <SelectItem value="open">Aberto</SelectItem>
                  <SelectItem value="in_progress">Em Progresso</SelectItem>
                  <SelectItem value="proposed_solution">Solução Proposta</SelectItem>
                  <SelectItem value="closed">Fechado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="type">Tipo</Label>
              <Select value={type} onValueChange={(value) => setValue('type', value as any)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bug">Bug</SelectItem>
                  <SelectItem value="feature_request">Pedido de Funcionalidade</SelectItem>
                  <SelectItem value="support">Suporte</SelectItem>
                  <SelectItem value="integration">Integração</SelectItem>
                  <SelectItem value="configuration">Configuração</SelectItem>
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

          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-gradient-primary hover:bg-gradient-primary/90">
              {ticket ? 'Actualizar' : 'Criar Ticket'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};