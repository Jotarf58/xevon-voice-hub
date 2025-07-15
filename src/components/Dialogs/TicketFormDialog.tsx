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
  description: string;
  status: 'open' | 'in_progress' | 'proposed_solution' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignee: string;
  team: string;
  category: string;
  source: 'call' | 'whatsapp' | 'manual';
  customer: string;
  customerPhone: string;
  createdAt: string;
  updatedAt: string;
}

interface TicketFormData {
  title: string;
  description: string;
  status: 'open' | 'in_progress' | 'proposed_solution' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignee: string;
  team: string;
  category: string;
  source: 'call' | 'whatsapp' | 'manual';
  customer: string;
  customerPhone: string;
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
      description: ticket.description,
      status: ticket.status,
      priority: ticket.priority,
      assignee: ticket.assignee,
      team: ticket.team,
      category: ticket.category,
      source: ticket.source,
      customer: ticket.customer,
      customerPhone: ticket.customerPhone
    } : {
      title: '',
      description: '',
      status: 'open',
      priority: 'medium',
      assignee: user?.name || '',
      team: user?.team || '',
      category: '',
      source: 'manual',
      customer: '',
      customerPhone: ''
    }
  });

  const status = watch('status');
  const priority = watch('priority');
  const team = watch('team');
  const category = watch('category');
  const source = watch('source');

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
              <Label htmlFor="priority">Prioridade</Label>
              <Select value={priority} onValueChange={(value) => setValue('priority', value as any)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a prioridade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Baixa</SelectItem>
                  <SelectItem value="medium">Média</SelectItem>
                  <SelectItem value="high">Alta</SelectItem>
                  <SelectItem value="urgent">Urgente</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="source">Origem</Label>
              <Select value={source} onValueChange={(value) => setValue('source', value as any)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a origem" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="call">Chamada</SelectItem>
                  <SelectItem value="whatsapp">WhatsApp</SelectItem>
                  <SelectItem value="manual">Manual</SelectItem>
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
                  <SelectItem value="Technical">Técnico</SelectItem>
                  <SelectItem value="Billing">Facturação</SelectItem>
                  <SelectItem value="General">Geral</SelectItem>
                  <SelectItem value="Integration">Integração</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="customer">Cliente</Label>
              <Input
                id="customer"
                {...register('customer', { required: true })}
                placeholder="Nome do cliente"
              />
            </div>

            <div>
              <Label htmlFor="customerPhone">Telefone do Cliente</Label>
              <Input
                id="customerPhone"
                {...register('customerPhone', { required: true })}
                placeholder="+351 XXX XXX XXX"
              />
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