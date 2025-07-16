import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/contexts/AuthContext';

interface Message {
  id: string;
  sender_number: string;
  receiver_number: string;
  content: string;
  message_type: string;
  status: 'sent' | 'delivered' | 'read' | 'failed';
  media_url: string | null;
  processed_by: string | null;
  created_at: string;
  sent_at: string;
  delivered_at: string | null;
  read_at: string | null;
}

interface MessageFormData {
  sender_number: string;
  receiver_number: string;
  content: string;
  message_type: string;
  status: 'sent' | 'delivered' | 'read' | 'failed';
  media_url: string;
}

interface MessageFormDialogProps {
  message?: Message;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (message: MessageFormData) => void;
}

export const MessageFormDialog: React.FC<MessageFormDialogProps> = ({
  message,
  open,
  onOpenChange,
  onSave
}) => {
  const { user } = useAuth();
  const { register, handleSubmit, setValue, watch, reset } = useForm<MessageFormData>({
    defaultValues: message ? {
      sender_number: message.sender_number,
      receiver_number: message.receiver_number,
      content: message.content,
      message_type: message.message_type,
      status: message.status,
      media_url: message.media_url || ''
    } : {
      sender_number: '',
      receiver_number: '',
      content: '',
      message_type: 'text',
      status: 'sent' as const,
      media_url: ''
    }
  });

  const status = watch('status');
  const messageType = watch('message_type');

  const onSubmit = (data: MessageFormData) => {
    onSave(data);
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {message ? 'Editar Mensagem' : 'Nova Mensagem'}
          </DialogTitle>
          <DialogDescription>
            {message ? 'Modifique os campos necessários' : 'Preencha os dados da nova mensagem'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="sender_number">Número do Remetente</Label>
              <Input
                id="sender_number"
                {...register('sender_number', { required: true })}
                placeholder="+351 XXX XXX XXX"
              />
            </div>

            <div>
              <Label htmlFor="receiver_number">Número do Destinatário</Label>
              <Input
                id="receiver_number"
                {...register('receiver_number', { required: true })}
                placeholder="+351 XXX XXX XXX"
              />
            </div>

            <div>
              <Label htmlFor="message_type">Tipo de Mensagem</Label>
              <Select value={messageType} onValueChange={(value) => setValue('message_type', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Texto</SelectItem>
                  <SelectItem value="image">Imagem</SelectItem>
                  <SelectItem value="audio">Áudio</SelectItem>
                  <SelectItem value="video">Vídeo</SelectItem>
                  <SelectItem value="document">Documento</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={status} onValueChange={(value) => setValue('status', value as any)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sent">Enviada</SelectItem>
                  <SelectItem value="delivered">Entregue</SelectItem>
                  <SelectItem value="read">Lida</SelectItem>
                  <SelectItem value="failed">Falhada</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="col-span-2">
              <Label htmlFor="content">Conteúdo</Label>
              <Textarea
                id="content"
                {...register('content', { required: true })}
                placeholder="Digite o conteúdo da mensagem"
                rows={3}
              />
            </div>

            {messageType !== 'text' && (
              <div className="col-span-2">
                <Label htmlFor="media_url">URL do Ficheiro</Label>
                <Input
                  id="media_url"
                  {...register('media_url')}
                  placeholder="https://exemplo.com/ficheiro.jpg"
                />
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-gradient-primary hover:bg-gradient-primary/90">
              {message ? 'Actualizar' : 'Criar Mensagem'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};