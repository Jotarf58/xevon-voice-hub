import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Phone, User, Clock, MapPin, Volume2, Edit, Trash2, Ticket } from 'lucide-react';

interface Call {
  id: string;
  customerName: string;
  customerPhone: string;
  status: 'incoming' | 'active' | 'completed' | 'missed' | 'error';
  duration: string;
  startTime: string;
  endTime?: string;
  location: string;
  twilioSid: string;
  recordingUrl?: string;
  aiAnalysis?: string;
  elevenlabsVoice?: string;
  assignedAgent?: string;
  notes?: string;
}

interface CallDetailsDialogProps {
  call: Call | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: (call: Call) => void;
  onDelete: (callId: string) => void;
  onConvertToTicket: (call: Call) => void;
}

export const CallDetailsDialog: React.FC<CallDetailsDialogProps> = ({
  call,
  open,
  onOpenChange,
  onEdit,
  onDelete,
  onConvertToTicket
}) => {
  if (!call) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'incoming': return 'bg-blue-500 text-white';
      case 'active': return 'bg-green-500 text-white animate-pulse';
      case 'completed': return 'bg-gray-500 text-white';
      case 'missed': return 'bg-red-500 text-white';
      case 'error': return 'bg-orange-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'incoming': return 'A Receber';
      case 'active': return 'Activa';
      case 'completed': return 'Concluída';
      case 'missed': return 'Perdida';
      case 'error': return 'Erro';
      default: return status;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Phone className="h-5 w-5" />
            Chamada de {call.customerName}
          </DialogTitle>
          <DialogDescription>
            Detalhes da chamada {call.id}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <Badge className={`text-xs ${getStatusColor(call.status)}`}>
              {getStatusLabel(call.status)}
            </Badge>
            <Badge variant="outline" className="text-xs">
              <Phone className="mr-1 h-3 w-3" />
              {call.customerPhone}
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Cliente</p>
                  <p className="text-sm text-muted-foreground">{call.customerName}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Telefone</p>
                  <p className="text-sm text-muted-foreground">{call.customerPhone}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Localização</p>
                  <p className="text-sm text-muted-foreground">{call.location}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Duração</p>
                  <p className="text-sm text-muted-foreground">{call.duration}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Início</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(call.startTime).toLocaleString('pt-BR')}
                  </p>
                </div>
              </div>

              {call.endTime && (
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Fim</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(call.endTime).toLocaleString('pt-BR')}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium">Twilio SID</p>
              <p className="text-sm text-muted-foreground font-mono">{call.twilioSid}</p>
            </div>

            {call.assignedAgent && (
              <div>
                <p className="text-sm font-medium">Agente Atribuído</p>
                <p className="text-sm text-muted-foreground">{call.assignedAgent}</p>
              </div>
            )}

            {call.elevenlabsVoice && (
              <div>
                <p className="text-sm font-medium">Voz ElevenLabs</p>
                <p className="text-sm text-muted-foreground">{call.elevenlabsVoice}</p>
              </div>
            )}

            {call.recordingUrl && (
              <div>
                <p className="text-sm font-medium">Gravação</p>
                <div className="flex items-center gap-2">
                  <Volume2 className="h-4 w-4 text-muted-foreground" />
                  <Button variant="link" className="p-0 h-auto text-primary">
                    Ouvir Gravação
                  </Button>
                </div>
              </div>
            )}

            {call.aiAnalysis && (
              <div>
                <p className="text-sm font-medium">Análise de IA</p>
                <p className="text-sm text-muted-foreground">{call.aiAnalysis}</p>
              </div>
            )}

            {call.notes && (
              <div>
                <p className="text-sm font-medium">Notas</p>
                <p className="text-sm text-muted-foreground">{call.notes}</p>
              </div>
            )}
          </div>

          <Separator />

          <div className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={() => {
                onConvertToTicket(call);
                onOpenChange(false);
              }}
            >
              <Ticket className="mr-2 h-4 w-4" />
              Converter em Ticket
            </Button>
            
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => onEdit(call)}>
                <Edit className="mr-2 h-4 w-4" />
                Editar
              </Button>
              <Button 
                variant="destructive" 
                onClick={() => {
                  onDelete(call.id);
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