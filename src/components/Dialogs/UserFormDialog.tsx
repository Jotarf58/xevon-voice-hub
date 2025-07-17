import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/contexts/AuthContext';

interface User {
  id: string;
  user_id: string;
  name: string;
  email: string;
  role: 'developer' | 'manager' | 'user';
  team: 'technical' | 'support' | 'sales' | 'management';
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

interface UserFormData {
  name: string;
  email: string;
  role: 'developer' | 'manager' | 'user';
  team: 'technical' | 'support' | 'sales' | 'management';
  avatar_url: string;
}

interface UserFormDialogProps {
  userProfile?: User;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (user: UserFormData) => void;
}

export const UserFormDialog: React.FC<UserFormDialogProps> = ({
  userProfile,
  open,
  onOpenChange,
  onSave
}) => {
  const { user } = useAuth();
  const { register, handleSubmit, setValue, watch, reset } = useForm<UserFormData>({
    defaultValues: {
      name: '',
      email: '',
      role: 'user' as const,
      team: 'support' as const,
      avatar_url: ''
    }
  });
  
  // Update form values when userProfile changes
  React.useEffect(() => {
    if (userProfile) {
      setValue('name', userProfile.name);
      setValue('email', userProfile.email);
      setValue('role', userProfile.role);
      setValue('team', userProfile.team);
      setValue('avatar_url', userProfile.avatar_url || '');
    } else {
      reset({
        name: '',
        email: '',
        role: 'user',
        team: 'support',
        avatar_url: ''
      });
    }
  }, [userProfile, setValue, reset]);

  const role = watch('role');
  const team = watch('team');

  // Define available roles based on current user's role
  const getAvailableRoles = () => {
    if (user?.role === 'developer') {
      return [
        { value: 'user', label: 'Utilizador' },
        { value: 'manager', label: 'Gestor' },
        { value: 'developer', label: 'Desenvolvedor' }
      ];
    } else if (user?.role === 'manager') {
      return [
        { value: 'user', label: 'Utilizador' }
      ];
    }
    return []; // Users can't create other users
  };

  const availableRoles = getAvailableRoles();

  const onSubmit = (data: UserFormData) => {
    onSave(data);
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {userProfile ? 'Editar Utilizador' : 'Novo Utilizador'}
          </DialogTitle>
          <DialogDescription>
            {userProfile ? 'Modifique os campos necessários' : 'Preencha os dados do novo utilizador'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                {...register('name', { required: true })}
                placeholder="Nome completo"
              />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...register('email', { required: true })}
                placeholder="utilizador@exemplo.com"
              />
            </div>

            <div>
              <Label htmlFor="role">Função</Label>
              <Select value={role} onValueChange={(value) => setValue('role', value as any)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a função" />
                </SelectTrigger>
                <SelectContent>
                  {availableRoles.map((roleOption) => (
                    <SelectItem key={roleOption.value} value={roleOption.value}>
                      {roleOption.label}
                    </SelectItem>
                  ))}
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

            <div className="col-span-2">
              <Label htmlFor="avatar_url">URL do Avatar</Label>
              <Input
                id="avatar_url"
                {...register('avatar_url')}
                placeholder="https://exemplo.com/avatar.jpg"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-gradient-primary hover:bg-gradient-primary/90">
              {userProfile ? 'Actualizar' : 'Criar Utilizador'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};