import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { 
  Settings, 
  Webhook,
  Palette,
  Server,
  Shield,
  Save,
  TestTube,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Moon,
  Sun,
  Monitor
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from '@/contexts/AuthContext';
import { toast } from "sonner";

interface N8NConfig {
  baseUrl: string;
  apiKey: string;
  webhookUrl: string;
  status: 'connected' | 'disconnected' | 'error';
  lastSync: string;
}

interface ThemeConfig {
  mode: 'light' | 'dark' | 'system';
  primaryColor: string;
  accentColor: string;
}

export const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  
  // Only admins can access settings
  if (user?.role !== 'admin') {
    return (
      <div className="p-6">
        <Card className="border-2">
          <CardContent className="p-12 text-center">
            <Shield className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Acesso Negado</h3>
            <p className="text-muted-foreground">
              Apenas administradores podem aceder às configurações do sistema.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const [n8nConfig, setN8nConfig] = useState<N8NConfig>({
    baseUrl: 'https://n8n.xevon.com',
    apiKey: '',
    webhookUrl: 'https://hooks.xevon.com/webhook/n8n',
    status: 'connected',
    lastSync: '2024-01-13T12:00:00Z'
  });

  const [themeConfig, setThemeConfig] = useState<ThemeConfig>({
    mode: 'system',
    primaryColor: '#3b82f6',
    accentColor: '#8b5cf6'
  });

  const [webhooks, setWebhooks] = useState([
    {
      id: 'wh-001',
      name: 'Tickets Webhook',
      url: 'https://hooks.xevon.com/webhook/tickets',
      events: ['ticket.created', 'ticket.updated', 'ticket.resolved'],
      active: true
    },
    {
      id: 'wh-002',
      name: 'Calls Webhook',
      url: 'https://hooks.xevon.com/webhook/calls',
      events: ['call.started', 'call.ended', 'call.failed'],
      active: true
    },
    {
      id: 'wh-003',
      name: 'Messages Webhook',
      url: 'https://hooks.xevon.com/webhook/messages',
      events: ['message.received', 'message.sent', 'message.failed'],
      active: true
    }
  ]);

  const [systemSettings, setSystemSettings] = useState({
    autoCreateTickets: true,
    aiAutoResponse: true,
    notificationEmails: true,
    logRetentionDays: 30,
    maxConcurrentCalls: 10,
    enableBackup: true
  });

  const handleTestN8NConnection = async () => {
    toast.loading("A testar ligação ao N8N...");
    
    // Simulate API call
    setTimeout(() => {
      const success = Math.random() > 0.3; // 70% success rate for demo
      
      if (success) {
        setN8nConfig({
          ...n8nConfig,
          status: 'connected',
          lastSync: new Date().toISOString()
        });
        toast.success("Ligação ao N8N estabelecida com sucesso!");
      } else {
        setN8nConfig({
          ...n8nConfig,
          status: 'error'
        });
        toast.error("Erro ao conectar com o N8N. Verifique as configurações.");
      }
    }, 2000);
  };

  const handleSaveN8NConfig = () => {
    // Simulate save
    toast.success("Configurações N8N guardadas com sucesso!");
  };

  const handleSaveTheme = () => {
    // Apply theme changes
    document.documentElement.setAttribute('data-theme', themeConfig.mode);
    toast.success("Configurações de tema guardadas!");
  };

  const handleSaveSystemSettings = () => {
    toast.success("Configurações do sistema guardadas!");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'text-green-600 bg-green-50 border-green-200';
      case 'disconnected': return 'text-gray-600 bg-gray-50 border-gray-200';
      case 'error': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected': return <CheckCircle className="h-4 w-4" />;
      case 'disconnected': return <XCircle className="h-4 w-4" />;
      case 'error': return <AlertTriangle className="h-4 w-4" />;
      default: return <XCircle className="h-4 w-4" />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Configurações</h1>
        <p className="text-muted-foreground mt-1">
          Configurar integrações, tema e definições do sistema
        </p>
      </div>

      <Tabs defaultValue="n8n" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="n8n">N8N & Webhooks</TabsTrigger>
          <TabsTrigger value="theme">Tema</TabsTrigger>
          <TabsTrigger value="system">Sistema</TabsTrigger>
          <TabsTrigger value="security">Segurança</TabsTrigger>
        </TabsList>

        <TabsContent value="n8n" className="space-y-6">
          {/* N8N Connection Status */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="h-5 w-5" />
                Estado da Ligação N8N
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-3">
                  {getStatusIcon(n8nConfig.status)}
                  <div>
                    <p className="font-medium text-foreground">
                      {n8nConfig.status === 'connected' ? 'Conectado' : 
                       n8nConfig.status === 'error' ? 'Erro de Ligação' : 'Desconectado'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Última sincronização: {new Date(n8nConfig.lastSync).toLocaleString('pt-BR')}
                    </p>
                  </div>
                </div>
                <Badge className={`border ${getStatusColor(n8nConfig.status)}`}>
                  {n8nConfig.status.toUpperCase()}
                </Badge>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="n8n-url">URL Base do N8N</Label>
                  <Input
                    id="n8n-url"
                    value={n8nConfig.baseUrl}
                    onChange={(e) => setN8nConfig({...n8nConfig, baseUrl: e.target.value})}
                    placeholder="https://n8n.xevon.com"
                  />
                </div>
                <div>
                  <Label htmlFor="n8n-api-key">Chave API</Label>
                  <Input
                    id="n8n-api-key"
                    type="password"
                    value={n8nConfig.apiKey}
                    onChange={(e) => setN8nConfig({...n8nConfig, apiKey: e.target.value})}
                    placeholder="n8n_api_key_..."
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="webhook-url">URL do Webhook</Label>
                <Input
                  id="webhook-url"
                  value={n8nConfig.webhookUrl}
                  onChange={(e) => setN8nConfig({...n8nConfig, webhookUrl: e.target.value})}
                  placeholder="https://hooks.xevon.com/webhook/n8n"
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={handleTestN8NConnection} variant="outline">
                  <TestTube className="mr-2 h-4 w-4" />
                  Testar Ligação
                </Button>
                <Button onClick={handleSaveN8NConfig}>
                  <Save className="mr-2 h-4 w-4" />
                  Guardar Configurações
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Webhooks Configuration */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Webhook className="h-5 w-5" />
                Configuração de Webhooks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {webhooks.map((webhook) => (
                  <div key={webhook.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium text-foreground">{webhook.name}</h4>
                      <p className="text-sm text-muted-foreground">{webhook.url}</p>
                      <div className="flex gap-1 mt-2">
                        {webhook.events.map((event) => (
                          <Badge key={event} variant="outline" className="text-xs">
                            {event}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <Switch
                      checked={webhook.active}
                      onCheckedChange={(checked) => 
                        setWebhooks(webhooks.map(w => 
                          w.id === webhook.id ? {...w, active: checked} : w
                        ))
                      }
                    />
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
                Configurações de Tema
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-base font-medium">Modo de Tema</Label>
                <div className="grid grid-cols-3 gap-4 mt-2">
                  <Button
                    variant={themeConfig.mode === 'light' ? 'default' : 'outline'}
                    onClick={() => setThemeConfig({...themeConfig, mode: 'light'})}
                    className="flex items-center gap-2"
                  >
                    <Sun className="h-4 w-4" />
                    Claro
                  </Button>
                  <Button
                    variant={themeConfig.mode === 'dark' ? 'default' : 'outline'}
                    onClick={() => setThemeConfig({...themeConfig, mode: 'dark'})}
                    className="flex items-center gap-2"
                  >
                    <Moon className="h-4 w-4" />
                    Escuro
                  </Button>
                  <Button
                    variant={themeConfig.mode === 'system' ? 'default' : 'outline'}
                    onClick={() => setThemeConfig({...themeConfig, mode: 'system'})}
                    className="flex items-center gap-2"
                  >
                    <Monitor className="h-4 w-4" />
                    Sistema
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="primary-color">Cor Primária</Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      id="primary-color"
                      type="color"
                      value={themeConfig.primaryColor}
                      onChange={(e) => setThemeConfig({...themeConfig, primaryColor: e.target.value})}
                      className="w-16 h-10"
                    />
                    <Input
                      value={themeConfig.primaryColor}
                      onChange={(e) => setThemeConfig({...themeConfig, primaryColor: e.target.value})}
                      placeholder="#3b82f6"
                      className="flex-1"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="accent-color">Cor de Destaque</Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      id="accent-color"
                      type="color"
                      value={themeConfig.accentColor}
                      onChange={(e) => setThemeConfig({...themeConfig, accentColor: e.target.value})}
                      className="w-16 h-10"
                    />
                    <Input
                      value={themeConfig.accentColor}
                      onChange={(e) => setThemeConfig({...themeConfig, accentColor: e.target.value})}
                      placeholder="#8b5cf6"
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>

              <Button onClick={handleSaveTheme}>
                <Save className="mr-2 h-4 w-4" />
                Aplicar Tema
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-6">
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Configurações do Sistema
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Criar Tickets Automaticamente</Label>
                    <p className="text-sm text-muted-foreground">
                      Criar tickets automaticamente a partir de chamadas e mensagens
                    </p>
                  </div>
                  <Switch
                    checked={systemSettings.autoCreateTickets}
                    onCheckedChange={(checked) => 
                      setSystemSettings({...systemSettings, autoCreateTickets: checked})
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Resposta Automática IA</Label>
                    <p className="text-sm text-muted-foreground">
                      Permitir que a IA responda automaticamente a mensagens simples
                    </p>
                  </div>
                  <Switch
                    checked={systemSettings.aiAutoResponse}
                    onCheckedChange={(checked) => 
                      setSystemSettings({...systemSettings, aiAutoResponse: checked})
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Emails de Notificação</Label>
                    <p className="text-sm text-muted-foreground">
                      Enviar emails de notificação para eventos importantes
                    </p>
                  </div>
                  <Switch
                    checked={systemSettings.notificationEmails}
                    onCheckedChange={(checked) => 
                      setSystemSettings({...systemSettings, notificationEmails: checked})
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Backup Automático</Label>
                    <p className="text-sm text-muted-foreground">
                      Realizar backup automático dos dados diariamente
                    </p>
                  </div>
                  <Switch
                    checked={systemSettings.enableBackup}
                    onCheckedChange={(checked) => 
                      setSystemSettings({...systemSettings, enableBackup: checked})
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="log-retention">Retenção de Logs (dias)</Label>
                  <Input
                    id="log-retention"
                    type="number"
                    value={systemSettings.logRetentionDays}
                    onChange={(e) => 
                      setSystemSettings({...systemSettings, logRetentionDays: parseInt(e.target.value)})
                    }
                    min="1"
                    max="365"
                  />
                </div>
                <div>
                  <Label htmlFor="max-calls">Máximo de Chamadas Simultâneas</Label>
                  <Input
                    id="max-calls"
                    type="number"
                    value={systemSettings.maxConcurrentCalls}
                    onChange={(e) => 
                      setSystemSettings({...systemSettings, maxConcurrentCalls: parseInt(e.target.value)})
                    }
                    min="1"
                    max="100"
                  />
                </div>
              </div>

              <Button onClick={handleSaveSystemSettings}>
                <Save className="mr-2 h-4 w-4" />
                Guardar Configurações
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
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-yellow-800">Configurações de Segurança</p>
                    <p className="text-sm text-yellow-700 mt-1">
                      Estas configurações afetam a segurança de todo o sistema. 
                      Altere apenas se souber o que está a fazer.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label>Chaves API Ativas</Label>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">Twilio API Key</p>
                        <p className="text-sm text-muted-foreground">Para chamadas de voz</p>
                      </div>
                      <Badge variant="outline" className="text-green-600 border-green-200">
                        Ativa
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">ElevenLabs API Key</p>
                        <p className="text-sm text-muted-foreground">Para síntese de voz</p>
                      </div>
                      <Badge variant="outline" className="text-green-600 border-green-200">
                        Ativa
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">WhatsApp Business API</p>
                        <p className="text-sm text-muted-foreground">Para mensagens WhatsApp</p>
                      </div>
                      <Badge variant="outline" className="text-green-600 border-green-200">
                        Ativa
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};