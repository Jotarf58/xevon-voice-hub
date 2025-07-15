import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Ticket, User, Calendar, Phone, MessageSquare, Clock, Edit, Trash2 } from 'lucide-react';

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

interface TicketDetailsDialogProps {
  ticket: TicketType | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: (ticket: TicketType) => void;
  onDelete: (ticketId: string) => void;
}

export const TicketDetailsDialog: React.FC<TicketDetailsDialogProps> = ({
  ticket,
  open,
  onOpenChange,
  onEdit,
  onDelete
}) => {
  if (!ticket) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-red-500 text-white';
      case 'in_progress': return 'bg-blue-500 text-white';
      case 'proposed_solution': return 'bg-yellow-500 text-black';
      case 'closed': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'call': return <Phone className="h-4 w-4" />;
      case 'whatsapp': return <MessageSquare className="h-4 w-4" />;
      default: return <Ticket className="h-4 w-4" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'open': return 'Aberto';
      case 'in_progress': return 'Em Progresso';
      case 'proposed_solution': return 'Solução Proposta';
      case 'closed': return 'Fechado';
      default: return status;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Ticket className="h-5 w-5" />
            {ticket.title}
          </DialogTitle>
          <DialogDescription>
            Detalhes do ticket {ticket.id}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <Badge className={`text-xs ${getStatusColor(ticket.status)}`}>
              {getStatusLabel(ticket.status)}
            </Badge>
            <Badge variant="outline" className={`text-xs border ${getPriorityColor(ticket.priority)}`}>
              {ticket.priority.toUpperCase()}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {getSourceIcon(ticket.source)}
              <span className="ml-1">{ticket.source.toUpperCase()}</span>
            </Badge>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Descrição</h3>
            <p className="text-muted-foreground">{ticket.description}</p>
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Responsável</p>
                  <p className="text-sm text-muted-foreground">{ticket.assignee}</p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium">Cliente</p>
                <p className="text-sm text-muted-foreground">{ticket.customer}</p>
              </div>

              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Telefone</p>
                  <p className="text-sm text-muted-foreground">{ticket.customerPhone}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium">Equipa</p>
                <p className="text-sm text-muted-foreground">{ticket.team}</p>
              </div>

              <div>
                <p className="text-sm font-medium">Categoria</p>
                <p className="text-sm text-muted-foreground">{ticket.category}</p>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Criado em</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(ticket.createdAt).toLocaleString('pt-BR')}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Última actualização</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(ticket.updatedAt).toLocaleString('pt-BR')}
                  </p>
                </div>
              </div>
            </div>
          </div>


          <Separator />

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onEdit(ticket)}>
              <Edit className="mr-2 h-4 w-4" />
              Editar
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => {
                onDelete(ticket.id);
                onOpenChange(false);
              }}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Eliminar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};