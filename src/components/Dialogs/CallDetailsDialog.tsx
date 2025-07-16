import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Phone, Edit } from 'lucide-react';

interface CallDetailsDialogProps {
  call: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: (call: any) => void;
}

export const CallDetailsDialog: React.FC<CallDetailsDialogProps> = ({
  call,
  open,
  onOpenChange,
  onEdit
}) => {
  if (!call) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Phone className="h-5 w-5" />
            Detalhes da Chamada
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium">Chamador</p>
              <p className="text-sm text-muted-foreground">{call.caller_number}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Receptor</p>
              <p className="text-sm text-muted-foreground">{call.receiver_number}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Status</p>
              <Badge>{call.status}</Badge>
            </div>
            <div>
              <p className="text-sm font-medium">Duração</p>
              <p className="text-sm text-muted-foreground">{call.duration || 0}s</p>
            </div>
          </div>

          <div className="flex justify-end">
            <Button variant="outline" onClick={() => onEdit(call)}>
              <Edit className="mr-2 h-4 w-4" />
              Editar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};