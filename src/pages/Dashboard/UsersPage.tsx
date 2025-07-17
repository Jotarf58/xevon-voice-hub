import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Search, 
  Plus,
  MoreHorizontal,
  Shield,
  UserCheck
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from '@/contexts/AuthContext';
import { useUsers } from '@/hooks/useSupabaseData';
import { UserDetailsDialog } from '@/components/Dialogs/UserDetailsDialog';
import { UserFormDialog } from '@/components/Dialogs/UserFormDialog';
import { supabase } from '@/integrations/supabase/client';

interface User {
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

export const UsersPage: React.FC = () => {
  const { user: currentUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterTeam, setFilterTeam] = useState('all');
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);

  // Real data from database
  const { users, loading, error, refetch } = useUsers();

  const handleViewUser = (user: any) => {
    setSelectedUser(user);
    setIsDetailsOpen(true);
  };

  const handleEditUser = async (user: any) => {
    console.log('Editar utilizador:', user);
    setSelectedUser(user);
    setIsFormDialogOpen(true);
  };

  const handleSaveUser = async (userData: any) => {
    try {
      // Get the current session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) {
        throw new Error('No active session');
      }

      if (selectedUser) {
        // This is an edit operation
        const response = await fetch(`https://dzscouyoqscqdixlwrlm.supabase.co/functions/v1/update-user`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR6c2NvdXlvcXNjcWRpeGx3cmxtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI1MTE4MjcsImV4cCI6MjA2ODA4NzgyN30.YFTuB3xSf6f6ebTBSkVLUT4vrm-vBxABo7MpG84zWZc'
          },
          body: JSON.stringify({
            id: selectedUser.id,
            name: userData.name,
            email: userData.email,
            role: userData.role,
            team: userData.team,
            avatar_url: userData.avatar_url
          })
        });
  
        const result = await response.json();
  
        if (!response.ok) {
          throw new Error(result.error || 'Failed to update user');
        }
  
        // Refresh the users list
        refetch();
        
        // Show success message
        console.log('Utilizador atualizado com sucesso:', result.user);
        alert('Utilizador atualizado com sucesso!');
      } else {
        // This is a create operation
        const response = await fetch(`https://dzscouyoqscqdixlwrlm.supabase.co/functions/v1/create-user`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR6c2NvdXlvcXNjcWRpeGx3cmxtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI1MTE4MjcsImV4cCI6MjA2ODA4NzgyN30.YFTuB3xSf6f6ebTBSkVLUT4vrm-vBxABo7MpG84zWZc'
          },
          body: JSON.stringify({
            name: userData.name,
            email: userData.email,
            role: userData.role,
            team: userData.team,
            avatar_url: userData.avatar_url
          })
        });
  
        const result = await response.json();
  
        if (!response.ok) {
          throw new Error(result.error || 'Failed to create user');
        }
  
        // Refresh the users list
        refetch();
        
        // Show success message
        console.log('Utilizador criado com sucesso:', result.user);
        alert('Utilizador criado com sucesso!');
      }
      
      // Reset selected user
      setSelectedUser(null);
      
    } catch (error) {
      console.error('Erro ao salvar utilizador:', error);
      alert(`Erro ao salvar utilizador: ${error.message}`);
      throw error;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'developer': return 'bg-red-100 text-red-800 border-red-200';
      case 'manager': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'user': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'developer': return <Shield className="h-4 w-4" />;
      case 'manager': return <UserCheck className="h-4 w-4" />;
      case 'user': return <Users className="h-4 w-4" />;
      default: return <Users className="h-4 w-4" />;
    }
  };

  const teams = ['technical', 'support', 'sales', 'management'];
  
  const filteredUsers = users
    .filter(user => 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(user => filterRole === 'all' || user.role === filterRole)
    .filter(user => filterTeam === 'all' || user.team === filterTeam);

  const userStats = {
    total: users.length,
    active: users.length, // All users are considered active in this simplified version
    developers: users.filter(u => u.role === 'developer').length,
    managers: users.filter(u => u.role === 'manager').length,
    users: users.filter(u => u.role === 'user').length
  };

  const canManageUsers = currentUser?.role === 'developer' || currentUser?.role === 'manager';

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Gestão de Utilizadores</h1>
          <p className="text-muted-foreground mt-1">
            Gerir utilizadores, permissões e equipas
          </p>
        </div>
        {canManageUsers && (
          <Button 
            className="bg-gradient-primary text-primary-foreground"
            onClick={() => setIsFormDialogOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Novo Utilizador
          </Button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="border-2">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-2xl font-bold text-foreground">{userStats.total}</p>
                <p className="text-sm text-muted-foreground">Total</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-2">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-2xl font-bold text-foreground">{userStats.active}</p>
                <p className="text-sm text-muted-foreground">Ativos</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-2">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-2xl font-bold text-foreground">{userStats.developers}</p>
                <p className="text-sm text-muted-foreground">Developers</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-2">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-2xl font-bold text-foreground">{userStats.managers}</p>
                <p className="text-sm text-muted-foreground">Gestores</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-2">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-2xl font-bold text-foreground">{userStats.users}</p>
                <p className="text-sm text-muted-foreground">Utilizadores</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border-2">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nome ou email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterRole} onValueChange={setFilterRole}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Função" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as Funções</SelectItem>
                <SelectItem value="developer">Developer</SelectItem>
                <SelectItem value="manager">Gestor</SelectItem>
                <SelectItem value="user">Utilizador</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterTeam} onValueChange={setFilterTeam}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Equipa" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as Equipas</SelectItem>
                {teams.map(team => (
                  <SelectItem key={team} value={team}>{team}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Loading State */}
      {loading && (
        <Card className="border-2">
          <CardContent className="p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Carregando utilizadores...</p>
          </CardContent>
        </Card>
      )}

      {/* Error State */}
      {error && (
        <Card className="border-2">
          <CardContent className="p-12 text-center">
            <Users className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Erro ao carregar utilizadores</h3>
            <p className="text-muted-foreground mb-4">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Users List */}
      {!loading && !error && (
        <div className="space-y-4">
          {filteredUsers.map((user) => (
          <Card key={user.id} className="border-2 hover:shadow-card transition-all duration-200 cursor-pointer" onClick={() => handleViewUser(user)}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold">
                    {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground text-lg">{user.name}</h3>
                    <p className="text-muted-foreground">{user.email}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className={`text-xs border ${getRoleColor(user.role)}`}>
                        {getRoleIcon(user.role)}
                        <span className="ml-1 capitalize">{user.role}</span>
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {user.team}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="text-right text-sm text-muted-foreground">
                    <p>Criado em:</p>
                    <p>{new Date(user.created_at).toLocaleDateString('pt-BR')}</p>
                  </div>
                  
                  {canManageUsers && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleViewUser(user); }}>
                          <Users className="mr-2 h-4 w-4" />
                          Ver Detalhes
                        </DropdownMenuItem>
                        {user.id !== currentUser?.id && (
                          <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleEditUser(user); }}>
                            Editar
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          ))}
        </div>
      )}

      {!loading && !error && filteredUsers.length === 0 && (
        <Card className="border-2">
          <CardContent className="p-12 text-center">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Nenhum utilizador encontrado</h3>
            <p className="text-muted-foreground">
              {searchTerm || filterRole !== 'all' || filterTeam !== 'all'
                ? 'Nenhum utilizador encontrado com os filtros aplicados.'
                : 'Nenhum utilizador registado ainda.'}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Dialog de Detalhes */}
      <UserDetailsDialog
        user={selectedUser}
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
        onEdit={handleEditUser}
        canEdit={canManageUsers && selectedUser?.id !== currentUser?.id}
      />

      {/* Dialog de Criação de Utilizador */}
      <UserFormDialog 
        userProfile={selectedUser}
        open={isFormDialogOpen}
        onOpenChange={(open) => {
          setIsFormDialogOpen(open);
          if (!open) setSelectedUser(null); // Reset selected user when dialog closes
        }}
        onSave={handleSaveUser}
      />
    </div>
  );
};