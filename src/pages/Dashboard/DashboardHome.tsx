import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useDashboardStats, useRecentTickets, useInitializeDemoData } from '@/hooks/useSupabaseData';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  CheckSquare, 
  Ticket, 
  Phone, 
  MessageSquare, 
  TrendingUp, 
  Clock,
  AlertCircle,
  Users,
  Plus,
  ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const DashboardHome: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { stats: dbStats, loading: statsLoading } = useDashboardStats();
  const { recentTickets, loading: ticketsLoading } = useRecentTickets();
  
  // Inicializar dados de demonstração para novos utilizadores
  useInitializeDemoData();

  const stats = [
    {
      title: "Tarefas Ativas",
      value: statsLoading ? "..." : dbStats.activeTasks.toString(),
      total: statsLoading ? "..." : dbStats.totalTasks.toString(),
      icon: <CheckSquare className="h-5 w-5" />,
      color: "text-blue-600"
    },
    {
      title: "Tickets Abertos",
      value: statsLoading ? "..." : dbStats.openTickets.toString(),
      total: statsLoading ? "..." : dbStats.totalTickets.toString(),
      icon: <Ticket className="h-5 w-5" />,
      color: "text-orange-600"
    },
    {
      title: "Chamadas Hoje",
      value: statsLoading ? "..." : dbStats.todayCalls.toString(),
      total: statsLoading ? "..." : dbStats.totalCalls.toString(),
      icon: <Phone className="h-5 w-5" />,
      color: "text-green-600"
    },
    {
      title: "Mensagens Hoje",
      value: statsLoading ? "..." : dbStats.todayMessages.toString(),
      total: statsLoading ? "..." : dbStats.totalMessages.toString(),
      icon: <MessageSquare className="h-5 w-5" />,
      color: "text-purple-600"
    }
  ];

  // Função para formatar tempo relativo
  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'há menos de 1 hora';
    if (diffInHours < 24) return `há ${diffInHours} hora${diffInHours > 1 ? 's' : ''}`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `há ${diffInDays} dia${diffInDays > 1 ? 's' : ''}`;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'open': return 'Aberto';
      case 'in_progress': return 'Em Progresso';
      case 'proposed_solution': return 'Solução Proposta';
      case 'closed': return 'Fechado';
      default: return status;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Olá, {user?.name?.split(' ')[0]}! 👋
          </h1>
          <p className="text-muted-foreground mt-1">
            Aqui está um resumo das suas atividades de hoje
          </p>
        </div>
        <Badge variant="outline" className="text-sm px-3 py-1">
          {user?.role?.toUpperCase()} • {user?.team}
        </Badge>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="border-2 hover:shadow-card transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className={`p-2 rounded-lg bg-muted/30 ${stat.color}`}>
                  {stat.icon}
                </div>
                <Badge variant="outline" className="text-xs">
                  Total: {stat.total}
                </Badge>
              </div>
              <div className="mt-4">
                <h3 className="text-2xl font-bold text-foreground">{stat.value}</h3>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Tickets */}
        <Card className="border-2">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl text-foreground">Tickets Recentes</CardTitle>
                <CardDescription>Últimas ocorrências que precisam de atenção</CardDescription>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate('/dashboard/tickets')}
              >
                Ver Todos
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {ticketsLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-start gap-4 p-4 rounded-lg border border-border">
                    <div className="w-3 h-3 rounded-full mt-2 bg-muted animate-pulse" />
                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="h-4 bg-muted rounded animate-pulse" />
                      <div className="h-3 bg-muted rounded w-3/4 animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            ) : recentTickets.length > 0 ? (
              recentTickets.map((ticket) => (
                <div key={ticket.id} className="flex items-start gap-4 p-4 rounded-lg border border-border hover:bg-muted/30 transition-colors">
                  <div className={`w-3 h-3 rounded-full mt-2 ${getPriorityColor(ticket.priority)}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-foreground truncate">{ticket.title}</h4>
                      <Badge variant="outline" className="text-xs">
                        #{ticket.id.slice(0, 8)}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>👤 {ticket.assignee?.name || 'Não atribuído'}</span>
                      <span>📋 {getStatusLabel(ticket.status)}</span>
                      <span>🕒 {getRelativeTime(ticket.created_at)}</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Ticket className="mx-auto h-12 w-12 mb-4 opacity-50" />
                <p>Nenhum ticket recente encontrado</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="border-2">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl text-foreground">Ações Rápidas</CardTitle>
            <CardDescription>Acesso rápido às funções mais utilizadas</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              className="w-full justify-start h-12" 
              variant="outline"
              onClick={() => navigate('/dashboard/tickets')}
            >
              <Ticket className="mr-3 h-5 w-5" />
              <div className="text-left">
                <div className="font-medium">Criar Novo Ticket</div>
                <div className="text-xs text-muted-foreground">Reportar uma nova ocorrência</div>
              </div>
            </Button>
            
            <Button 
              className="w-full justify-start h-12" 
              variant="outline"
              onClick={() => navigate('/dashboard/tasks')}
            >
              <CheckSquare className="mr-3 h-5 w-5" />
              <div className="text-left">
                <div className="font-medium">Nova Tarefa</div>
                <div className="text-xs text-muted-foreground">Adicionar item à sua lista</div>
              </div>
            </Button>
            
            <Button 
              className="w-full justify-start h-12" 
              variant="outline"
              onClick={() => navigate('/dashboard/calls')}
            >
              <Phone className="mr-3 h-5 w-5" />
              <div className="text-left">
                <div className="font-medium">Monitorar Chamadas</div>
                <div className="text-xs text-muted-foreground">Ver chamadas em tempo real</div>
              </div>
            </Button>
            
            <Button 
              className="w-full justify-start h-12" 
              variant="outline"
              onClick={() => navigate('/dashboard/messages')}
            >
              <MessageSquare className="mr-3 h-5 w-5" />
              <div className="text-left">
                <div className="font-medium">Verificar Mensagens</div>
                <div className="text-xs text-muted-foreground">Acompanhar conversas WhatsApp</div>
              </div>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};