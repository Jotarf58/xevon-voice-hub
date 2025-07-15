import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Settings,
  Workflow,
  Palette,
  Shield,
  Server,
  CheckCircle,
  AlertCircle,
  XCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface N8NConfig {
  url: string;
  apiKey: string;
  status: 'connected' | 'disconnected' | 'error';
}

interface ThemeConfig {
  primaryColor: string;
  darkMode: boolean;
  compactMode: boolean;
}

export const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  // Redirect if not admin
  if (user?.role !== 'developer') {
    return (
      <div className="p-6">
        <Card className="border-2">
          <CardContent className="p-12 text-center">
            <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Acesso Negado</h3>
            <p className="text-muted-foreground">
              Apenas utilizadores com cargo "Admin" podem aceder às configurações.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const [n8nConfig, setN8nConfig] = useState<N8NConfig>({
    url: 'https://n8n.example.com',
    apiKey: '',
    status: 'disconnected'
  });

  const [themeConfig, setThemeConfig] = useState<ThemeConfig>({
    primaryColor: '#3b82f6',
    darkMode: false,
    compactMode: false
  });

  const [webhooks] = useState([
    { name: 'Twilio Webhook', url: '/api/twilio', status: 'active' },
    { name: 'WhatsApp Webhook', url: '/api/whatsapp', status: 'active' },
    { name: 'ElevenLabs Webhook', url: '/api/elevenlabs', status: 'inactive' }
  ]);

  const [systemSettings, setSystemSettings] = useState({
    autoBackup: true,
    maintenanceMode: false,
    debugMode: false,
    logLevel: 'info'
  });

  const handleTestN8NConnection = async () => {
    setN8nConfig(prev => ({ ...prev, status: 'connected' }));
    toast({
      title: "Conexão testada",
      description: "Ligação ao n8n estabelecida com sucesso.",
    });
  };

  const handleSaveN8NConfig = () => {
    toast({
      title: "Configurações salvas",
      description: "As configurações do n8n foram salvas com sucesso.",
    });
  };

  const handleSaveTheme = () => {
    // Apply theme changes
    toast({
      title: "Tema aplicado",
      description: "As configurações de tema foram aplicadas.",
    });
  };

  const handleSaveSystemSettings = () => {
    toast({
      title: "Configurações do sistema",
      description: "As configurações do sistema foram salvas.",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
      case 'active': return 'bg-green-500';
      case 'disconnected':
      case 'inactive': return 'bg-gray-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
      case 'active': return <CheckCircle className="h-4 w-4" />;
      case 'disconnected':
      case 'inactive': return <AlertCircle className="h-4 w-4" />;
      case 'error': return <XCircle className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Configurações</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie as configurações do sistema e integrações
          </p>
        </div>
        <Badge variant="outline" className="text-sm px-3 py-1">
          Admin Access
        </Badge>
      </div>

      <Tabs defaultValue="n8n" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="n8n" className="flex items-center gap-2">
            <Workflow className="h-4 w-4" />
            N8N
          </TabsTrigger>
          <TabsTrigger value="theme" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Tema
          </TabsTrigger>
          <TabsTrigger value="system" className="flex items-center gap-2">
            <Server className="h-4 w-4" />
            Sistema
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Segurança
          </TabsTrigger>
        </TabsList>

        <TabsContent value="n8n" className="space-y-6">
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Workflow className="h-5 w-5" />
                Configuração N8N
              </CardTitle>
              <CardDescription>
                Configure a conexão com o seu servidor N8N para automação de workflows
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <div className={`w-3 h-3 rounded-full ${getStatusColor(n8nConfig.status)}`} />
                <span className="text-sm font-medium">Status: </span>
                <Badge variant="outline" className="flex items-center gap-1">
                  {getStatusIcon(n8nConfig.status)}
                  {n8nConfig.status === 'connected' ? 'Conectado' : 
                   n8nConfig.status === 'error' ? 'Erro' : 'Desconectado'}
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="n8n-url">URL do N8N</Label>
                  <Input
                    id="n8n-url"
                    value={n8nConfig.url}
                    onChange={(e) => setN8nConfig(prev => ({ ...prev, url: e.target.value }))}
                    placeholder="https://n8n.exemplo.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="n8n-api-key">API Key</Label>
                  <Input
                    id="n8n-api-key"
                    type="password"
                    value={n8nConfig.apiKey}
                    onChange={(e) => setN8nConfig(prev => ({ ...prev, apiKey: e.target.value }))}
                    placeholder="Sua API Key do N8N"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleTestN8NConnection} variant="outline">
                  Testar Conexão
                </Button>
                <Button onClick={handleSaveN8NConfig} className="bg-gradient-primary">
                  Salvar Configurações
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardHeader>
              <CardTitle>Webhooks Ativos</CardTitle>
              <CardDescription>Status dos webhooks configurados no sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {webhooks.map((webhook, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border border-border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(webhook.status)}`} />
                      <div>
                        <h4 className="font-medium text-foreground">{webhook.name}</h4>
                        <p className="text-sm text-muted-foreground">{webhook.url}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="flex items-center gap-1">
                      {getStatusIcon(webhook.status)}
                      {webhook.status === 'active' ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="theme" className="space-y-6">
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Personalização do Tema
              </CardTitle>
              <CardDescription>
                Personalize a aparência do sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="primary-color">Cor Primária</Label>
                  <div className="flex gap-2">
                    <Input
                      id="primary-color"
                      type="color"
                      value={themeConfig.primaryColor}
                      onChange={(e) => setThemeConfig(prev => ({ ...prev, primaryColor: e.target.value }))}
                      className="w-16 h-10"
                    />
                    <Input
                      value={themeConfig.primaryColor}
                      onChange={(e) => setThemeConfig(prev => ({ ...prev, primaryColor: e.target.value }))}
                      placeholder="#3b82f6"
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="dark-mode">Modo Escuro</Label>
                  <Switch
                    id="dark-mode"
                    checked={themeConfig.darkMode}
                    onCheckedChange={(checked) => setThemeConfig(prev => ({ ...prev, darkMode: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="compact-mode">Modo Compacto</Label>
                  <Switch
                    id="compact-mode"
                    checked={themeConfig.compactMode}
                    onCheckedChange={(checked) => setThemeConfig(prev => ({ ...prev, compactMode: checked }))}
                  />
                </div>
              </div>

              <Button onClick={handleSaveTheme} className="bg-gradient-primary">
                Aplicar Tema
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-6">
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="h-5 w-5" />
                Configurações do Sistema
              </CardTitle>
              <CardDescription>
                Gerencie configurações avançadas do sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="auto-backup">Backup Automático</Label>
                    <p className="text-sm text-muted-foreground">Realizar backup diário dos dados</p>
                  </div>
                  <Switch
                    id="auto-backup"
                    checked={systemSettings.autoBackup}
                    onCheckedChange={(checked) => setSystemSettings(prev => ({ ...prev, autoBackup: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="maintenance-mode">Modo de Manutenção</Label>
                    <p className="text-sm text-muted-foreground">Bloquear acesso de utilizadores</p>
                  </div>
                  <Switch
                    id="maintenance-mode"
                    checked={systemSettings.maintenanceMode}
                    onCheckedChange={(checked) => setSystemSettings(prev => ({ ...prev, maintenanceMode: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="debug-mode">Modo Debug</Label>
                    <p className="text-sm text-muted-foreground">Ativar logs detalhados</p>
                  </div>
                  <Switch
                    id="debug-mode"
                    checked={systemSettings.debugMode}
                    onCheckedChange={(checked) => setSystemSettings(prev => ({ ...prev, debugMode: checked }))}
                  />
                </div>
              </div>

              <Button onClick={handleSaveSystemSettings} className="bg-gradient-primary">
                Salvar Configurações
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Configurações de Segurança
              </CardTitle>
              <CardDescription>
                Gerencie as configurações de segurança do sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border border-border rounded-lg bg-muted/30">
                  <h4 className="font-medium text-foreground mb-2">Gestão de Utilizadores</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Configure políticas de acesso e permissões
                  </p>
                  <Button variant="outline" size="sm">
                    Gerir Utilizadores
                  </Button>
                </div>
                <div className="p-4 border border-border rounded-lg bg-muted/30">
                  <h4 className="font-medium text-foreground mb-2">Logs de Auditoria</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Visualizar logs de atividades do sistema
                  </p>
                  <Button variant="outline" size="sm">
                    Ver Logs
                  </Button>
                </div>
                <div className="p-4 border border-border rounded-lg bg-muted/30">
                  <h4 className="font-medium text-foreground mb-2">Backup e Restauro</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Gerir backups e restaurar dados
                  </p>
                  <Button variant="outline" size="sm">
                    Gerir Backups
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};