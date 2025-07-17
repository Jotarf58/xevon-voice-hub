import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { MessageSquare, User, Clock, Phone, Calendar } from 'lucide-react';

interface Message {
  id: string;
  sender_number: string;
  receiver_number: string;
  content: string;
  message_type: string;
  status: 'sent' | 'delivered' | 'read' | 'failed';
  media_url: string | null;
  processed_by: string | null;
  sent_at: string;
  delivered_at: string | null;
  read_at: string | null;
  created_at: string;
}

interface SimpleMessageDetailsDialogProps {
  message: Message | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SimpleMessageDetailsDialog: React.FC<SimpleMessageDetailsDialogProps> = ({
  message,
  open,
  onOpenChange
}) => {
  if (!message) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'read': return 'bg-green-500 text-white';
      case 'delivered': return 'bg-blue-500 text-white';
      case 'sent': return 'bg-yellow-500 text-black';
      case 'failed': return 'bg-red-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'read': return 'Lida';
      case 'delivered': return 'Entregue';
      case 'sent': return 'Enviada';
      case 'failed': return 'Falhada';
      default: return status;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <MessageSquare className="h-5 w-5" />
            Detalhes da Mensagem
          </DialogTitle>
          <DialogDescription>
            Mensagem {message.id}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <Badge className={`text-xs ${getStatusColor(message.status)}`}>
              {getStatusLabel(message.status)}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {message.message_type}
            </Badge>
            {message.media_url && (
              <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200">
                📎 Mídia
              </Badge>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Remetente</p>
                  <p className="text-sm text-muted-foreground">{message.sender_number}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Destinatário</p>
                  <p className="text-sm text-muted-foreground">{message.receiver_number}</p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium">Tipo</p>
                <p className="text-sm text-muted-foreground">{message.message_type}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Enviada</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(message.sent_at).toLocaleString('pt-BR')}
                  </p>
                </div>
              </div>

              {message.delivered_at && (
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Entregue</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(message.delivered_at).toLocaleString('pt-BR')}
                    </p>
                  </div>
                </div>
              )}

              {message.read_at && (
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Lida</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(message.read_at).toLocaleString('pt-BR')}
                    </p>
                  </div>
                </div>
              )}

              {message.processed_by && (
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Processado por</p>
                    <p className="text-sm text-muted-foreground">{message.processed_by}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold mb-2">Conteúdo da Mensagem</h3>
            <div className="bg-muted/30 rounded-lg p-4">
              <p className="text-sm">{message.content}</p>
            </div>
          </div>

          {message.media_url && (
            <div>
              <h3 className="font-semibold mb-2">Mídia Anexada</h3>
              <a 
                href={message.media_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:text-blue-800 underline"
              >
                Ver anexo
              </a>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};