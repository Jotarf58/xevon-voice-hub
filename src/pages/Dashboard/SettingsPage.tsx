
import React, { useState } from 'react';
import { ModuleGuard } from '@/components/ModuleProtection/ModuleGuard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, User, Bell, Shield, Database } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const SettingsPageContent = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [autoSave, setAutoSave] = useState(true);

  const handleSaveProfile = () => {
    toast.success('Perfil atualizado com sucesso!');
  };

  const handleSaveNotifications = () => {
    toast.success('Configurações de notificação atualizadas!');
  };

  const handleSaveSecurity = () => {
    toast.success('Configurações de segurança atualizadas!');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
        <p className="text-muted-foreground">
          Gerencie suas preferências e configurações do sistema
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Perfil
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notificações
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Segurança
          </TabsTrigger>
          <TabsTrigger value="system" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Sistema
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações do Perfil</CardTitle>
              <CardDescription>
                Atualize suas informações pessoais
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome</Label>
                  <Input id="name" defaultValue={user?.name} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue={user?.email} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Função</Label>
                <Input id="role" defaultValue={user?.role} disabled />
              </div>
              <Button onClick={handleSaveProfile}>
                Salvar Alterações
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Preferências de Notificação</CardTitle>
              <CardDescription>
                Configure como você deseja receber notificações
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Notificações por Email</Label>
                  <div className="text-sm text-muted-foreground">
                    Receba notificações importantes por email
                  </div>
                </div>
                <Switch 
                  checked={notifications} 
                  onCheckedChange={setNotifications}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Modo Escuro</Label>
                  <div className="text-sm text-muted-foreground">
                    Use o tema escuro na interface
                  </div>
                </div>
                <Switch 
                  checked={darkMode} 
                  onCheckedChange={setDarkMode}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Salvamento Automático</Label>
                  <div className="text-sm text-muted-foreground">
                    Salve automaticamente suas alterações
                  </div>
                </div>
                <Switch 
                  checked={autoSave} 
                  onCheckedChange={setAutoSave}
                />
              </div>
              <Button onClick={handleSaveNotifications}>
                Salvar Preferências
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Segurança</CardTitle>
              <CardDescription>
                Gerencie a segurança da sua conta
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Senha Atual</Label>
                <Input id="current-password" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">Nova Senha</Label>
                <Input id="new-password" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirmar Nova Senha</Label>
                <Input id="confirm-password" type="password" />
              </div>
              <Button onClick={handleSaveSecurity}>
                Alterar Senha
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações do Sistema</CardTitle>
              <CardDescription>
                Informações sobre o sistema e configurações avançadas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Versão do Sistema</Label>
                  <p className="text-sm text-muted-foreground">v1.0.0</p>
                </div>
                <div>
                  <Label>Tipo de Usuário</Label>
                  <p className="text-sm text-muted-foreground">
                    {user?.role === 'XEVON' ? 'Administrador' : user?.isPaidUser ? 'Usuário Pago' : 'Usuário Gratuito'}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Último Login</Label>
                  <p className="text-sm text-muted-foreground">
                    {new Date().toLocaleString('pt-BR')}
                  </p>
                </div>
                <div>
                  <Label>Status da Conta</Label>
                  <p className="text-sm text-green-600">Ativa</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default function SettingsPage() {
  return (
    <ModuleGuard moduleName="settings">
      <SettingsPageContent />
    </ModuleGuard>
  );
}
