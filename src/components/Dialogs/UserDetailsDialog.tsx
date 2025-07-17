import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Users, User, Shield, UserCheck, Calendar, Mail, Edit } from 'lucide-react';

interface UserType {
  id: string;
  name: string;
  email: string;
  role: 'developer' | 'manager' | 'user';
  team: 'technical' | 'support' | 'sales' | 'management';
  avatar_url: string | null;
  user_id: string;
  created_at: string;
  updated_at: string;
}

interface UserDetailsDialogProps {
  user: UserType | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit?: (user: UserType) => void;
  canEdit?: boolean;
}

export const UserDetailsDialog: React.FC<UserDetailsDialogProps> = ({
  user,
  open,
  onOpenChange,
  onEdit,
  canEdit = false
}) => {
  if (!user) return null;

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'developer': return 'bg-red-100 text-red-800 border-red-200';
      case 'manager': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'user': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTeamColor = (team: string) => {
    switch (team) {
      case 'technical': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'support': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'sales': return 'bg-green-100 text-green-800 border-green-200';
      case 'management': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'developer': return <Shield className="h-4 w-4" />;
      case 'manager': return <UserCheck className="h-4 w-4" />;
      case 'user': return <User className="h-4 w-4" />;
      default: return <Users className="h-4 w-4" />;
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'developer': return 'Desenvolvedor';
      case 'manager': return 'Gestor';
      case 'user': return 'Utilizador';
      default: return role;
    }
  };

  const getTeamLabel = (team: string) => {
    switch (team) {
      case 'technical': return 'Técnica';
      case 'support': return 'Suporte';
      case 'sales': return 'Vendas';
      case 'management': return 'Gestão';
      default: return team;
    }
  };

  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Users className="h-5 w-5" />
            Detalhes do Utilizador
          </DialogTitle>
          <DialogDescription>
            Informações detalhadas do utilizador {user.name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* User Avatar and Basic Info */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-xl">
              {getUserInitials(user.name)}
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-foreground">{user.name}</h2>
              <div className="flex items-center gap-2 mt-1">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">{user.email}</span>
              </div>
            </div>
          </div>

          {/* Badges */}
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline" className={`text-xs border ${getRoleColor(user.role)}`}>
              {getRoleIcon(user.role)}
              <span className="ml-1">{getRoleLabel(user.role)}</span>
            </Badge>
            <Badge variant="outline" className={`text-xs border ${getTeamColor(user.team)}`}>
              {getTeamLabel(user.team)}
            </Badge>
          </div>

          <Separator />

          {/* Detailed Information */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-foreground">Nome Completo</p>
                <p className="text-sm text-muted-foreground">{user.name}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-foreground">Email</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-foreground">Função</p>
                <div className="flex items-center gap-2 mt-1">
                  {getRoleIcon(user.role)}
                  <span className="text-sm text-muted-foreground">{getRoleLabel(user.role)}</span>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-foreground">Equipa</p>
                <p className="text-sm text-muted-foreground">{getTeamLabel(user.team)}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-foreground">ID do Utilizador</p>
                <p className="text-sm text-muted-foreground font-mono">{user.user_id}</p>
              </div>

              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-foreground">Data de Criação</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(user.created_at).toLocaleString('pt-BR')}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-foreground">Última Atualização</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(user.updated_at).toLocaleString('pt-BR')}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-foreground">Status</p>
                <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                  ✅ Ativo
                </Badge>
              </div>
            </div>
          </div>

          <Separator />

          {/* Action Buttons */}
          {canEdit && onEdit && (
            <div className="flex justify-end">
              <Button variant="outline" onClick={() => onEdit(user)}>
                <Edit className="mr-2 h-4 w-4" />
                Editar Utilizador
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};