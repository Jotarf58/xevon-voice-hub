import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/contexts/AuthContext';

interface Call {
  id: string;
  caller_number: string;
  receiver_number: string;
  status: 'active' | 'completed' | 'missed' | 'failed';
  duration: number | null;
  notes: string | null;
  handled_by: string | null;
  started_at: string;
  ended_at: string | null;
  created_at: string;
}

interface CallFormData {
  caller_number: string;
  receiver_number: string;
  status: 'active' | 'completed' | 'missed' | 'failed';
  duration: number;
  notes: string;
}

interface CallFormDialogProps {
  call?: Call;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (call: CallFormData) => void;
}

export const CallFormDialog: React.FC<CallFormDialogProps> = ({
  call,
  open,
  onOpenChange,
  onSave
}) => {
  const { user } = useAuth();
  const { register, handleSubmit, setValue, watch, reset } = useForm<CallFormData>({
    defaultValues: call ? {
      caller_number: call.caller_number,
      receiver_number: call.receiver_number,
      status: call.status,
      duration: call.duration || 0,
      notes: call.notes || ''
    } : {
      caller_number: '',
      receiver_number: '',
      status: 'active' as const,
      duration: 0,
      notes: ''
    }
  });

  const status = watch('status');

  const onSubmit = (data: CallFormData) => {
    onSave(data);
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {call ? 'Editar Chamada' : 'Nova Chamada'}
          </DialogTitle>
          <DialogDescription>
            {call ? 'Modifique os campos necessários' : 'Preencha os dados da nova chamada'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="caller_number">Número do Chamador</Label>
              <Input
                id="caller_number"
                {...register('caller_number', { required: true })}
                placeholder="+351 XXX XXX XXX"
              />
            </div>

            <div>
              <Label htmlFor="receiver_number">Número do Receptor</Label>
              <Input
                id="receiver_number"
                {...register('receiver_number', { required: true })}
                placeholder="+351 XXX XXX XXX"
              />
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={status} onValueChange={(value) => setValue('status', value as any)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Ativa</SelectItem>
                  <SelectItem value="completed">Concluída</SelectItem>
                  <SelectItem value="missed">Perdida</SelectItem>
                  <SelectItem value="failed">Falhada</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="duration">Duração (segundos)</Label>
              <Input
                id="duration"
                type="number"
                {...register('duration', { valueAsNumber: true })}
                placeholder="0"
              />
            </div>

            <div className="col-span-2">
              <Label htmlFor="notes">Notas</Label>
              <Textarea
                id="notes"
                {...register('notes')}
                placeholder="Adicione notas sobre a chamada"
                rows={3}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-gradient-primary hover:bg-gradient-primary/90">
              {call ? 'Actualizar' : 'Criar Chamada'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};