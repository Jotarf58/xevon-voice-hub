
import React, { useState, useEffect } from 'react';
import { ModuleGuard } from '@/components/ModuleProtection/ModuleGuard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Users, Search, Plus, Mail, Phone } from 'lucide-react';
import { useSupabaseData } from '@/hooks/useSupabaseData';
import { UserFormDialog } from '@/components/Dialogs/UserFormDialog';
import { UserDetailsDialog } from '@/components/Dialogs/UserDetailsDialog';

const UsersPageContent = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const { data: users, loading, error, refetch } = useSupabaseData({
    table: 'users',
    select: '*',
    orderBy: { column: 'created_at', ascending: false }
  });

  const filteredUsers = users?.filter(user => 
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.phone_number?.toString().includes(searchTerm)
  ) || [];

  const handleViewDetails = (user: any) => {
    setSelectedUser(user);
    setIsDetailsOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Utilizadores</h1>
          <p className="text-muted-foreground">
            Gerencie utilizadores do sistema
          </p>
        </div>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Utilizador
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Pesquisar por nome, email ou telefone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-3 bg-muted rounded"></div>
                  <div className="h-3 bg-muted rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : error ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              Erro ao carregar utilizadores: {error}
            </p>
          </CardContent>
        </Card>
      ) : filteredUsers.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                {searchTerm ? 'Nenhum utilizador encontrado.' : 'Nenhum utilizador registrado ainda.'}
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredUsers.map((user) => (
            <Card key={user.id_user} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  {user.name || 'N/A'}
                </CardTitle>
                <CardDescription>
                  Utilizador #{user.id_user}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {user.email && (
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="truncate">{user.email}</span>
                    </div>
                  )}
                  {user.phone_number && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{user.phone_number}</span>
                    </div>
                  )}
                  {user.created_at && (
                    <div className="text-xs text-muted-foreground">
                      Criado em: {new Date(user.created_at).toLocaleDateString('pt-BR')}
                    </div>
                  )}
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full mt-2"
                    onClick={() => handleViewDetails(user)}
                  >
                    Ver Detalhes
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <UserFormDialog 
        open={isFormOpen} 
        onOpenChange={setIsFormOpen}
        onSuccess={() => {
          refetch();
          setIsFormOpen(false);
        }}
      />

      <UserDetailsDialog
        user={selectedUser}
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
      />
    </div>
  );
};

export default function UsersPage() {
  return (
    <ModuleGuard moduleName="users">
      <UsersPageContent />
    </ModuleGuard>
  );
}
