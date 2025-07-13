import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { MessageSquare, User, Clock, Bot, Edit, Trash2, Ticket } from 'lucide-react';

interface Message {
  id: string;
  customerName: string;
  customerPhone: string;
  platform: 'whatsapp' | 'telegram' | 'sms';
  status: 'received' | 'processing' | 'responded' | 'error' | 'pending';
  lastMessage: string;
  messageCount: number;
  timestamp: string;
  assignedAgent?: string;
  isAiHandled: boolean;
  aiConfidence?: number;
  customerSatisfaction?: number;
  conversationSummary?: string;
  tags: string[];
}

interface MessageDetailsDialogProps {
  message: Message | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: (message: Message) => void;
  onDelete: (messageId: string) => void;
  onConvertToTicket: (message: Message) => void;
}

export const MessageDetailsDialog: React.FC<MessageDetailsDialogProps> = ({
  message,
  open,
  onOpenChange,
  onEdit,
  onDelete,
  onConvertToTicket
}) => {
  if (!message) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'received': return 'bg-blue-500 text-white';
      case 'processing': return 'bg-yellow-500 text-black animate-pulse';
      case 'responded': return 'bg-green-500 text-white';
      case 'error': return 'bg-red-500 text-white';
      case 'pending': return 'bg-gray-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'whatsapp': return 'bg-green-100 text-green-800 border-green-200';
      case 'telegram': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'sms': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'received': return 'Recebida';
      case 'processing': return 'A Processar';
      case 'responded': return 'Respondida';
      case 'error': return 'Erro';
      case 'pending': return 'Pendente';
      default: return status;
    }
  };

  const getSatisfactionColor = (satisfaction?: number) => {
    if (!satisfaction) return 'bg-gray-100 text-gray-800';
    if (satisfaction >= 8) return 'bg-green-100 text-green-800';
    if (satisfaction >= 6) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <MessageSquare className="h-5 w-5" />
            Conversa com {message.customerName}
          </DialogTitle>
          <DialogDescription>
            Detalhes da conversa {message.id}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge className={`text-xs ${getStatusColor(message.status)}`}>
              {getStatusLabel(message.status)}
            </Badge>
            <Badge variant="outline" className={`text-xs border ${getPlatformColor(message.platform)}`}>
              {message.platform.toUpperCase()}
            </Badge>
            {message.isAiHandled && (
              <Badge variant="outline" className="text-xs">
                <Bot className="mr-1 h-3 w-3" />
                IA
              </Badge>
            )}
            {message.aiConfidence && (
              <Badge variant="outline" className="text-xs">
                Confiança: {(message.aiConfidence * 100).toFixed(0)}%
              </Badge>
            )}
            {message.customerSatisfaction && (
              <Badge variant="outline" className={`text-xs ${getSatisfactionColor(message.customerSatisfaction)}`}>
                Satisfação: {message.customerSatisfaction}/10
              </Badge>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Cliente</p>
                  <p className="text-sm text-muted-foreground">{message.customerName}</p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium">Telefone</p>
                <p className="text-sm text-muted-foreground">{message.customerPhone}</p>
              </div>

              <div>
                <p className="text-sm font-medium">Total de Mensagens</p>
                <p className="text-sm text-muted-foreground">{message.messageCount}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Última Actividade</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(message.timestamp).toLocaleString('pt-BR')}
                  </p>
                </div>
              </div>

              {message.assignedAgent && (
                <div>
                  <p className="text-sm font-medium">Agente Atribuído</p>
                  <p className="text-sm text-muted-foreground">{message.assignedAgent}</p>
                </div>
              )}

              <div>
                <p className="text-sm font-medium">Processamento</p>
                <p className="text-sm text-muted-foreground">
                  {message.isAiHandled ? 'Automático (IA)' : 'Manual'}
                </p>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold mb-2">Última Mensagem</h3>
            <div className="bg-muted p-3 rounded-lg">
              <p className="text-sm">{message.lastMessage}</p>
            </div>
          </div>

          {message.conversationSummary && (
            <div>
              <h3 className="font-semibold mb-2">Resumo da Conversa</h3>
              <p className="text-sm text-muted-foreground">{message.conversationSummary}</p>
            </div>
          )}

          {message.tags.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {message.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <Separator />

          <div className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={() => {
                onConvertToTicket(message);
                onOpenChange(false);
              }}
            >
              <Ticket className="mr-2 h-4 w-4" />
              Converter em Ticket
            </Button>
            
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => onEdit(message)}>
                <Edit className="mr-2 h-4 w-4" />
                Editar
              </Button>
              <Button 
                variant="destructive" 
                onClick={() => {
                  onDelete(message.id);
                  onOpenChange(false);
                }}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Eliminar
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};