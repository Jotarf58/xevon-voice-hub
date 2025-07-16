import React, { useState } from 'react';
import { useMessages } from '@/hooks/useSupabaseData';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  MessageSquare, 
  Send,
  AlertTriangle,
  Search, 
  CheckCircle,
  MoreHorizontal,
  User,
  Calendar
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

interface Message {
  id: string;
  sender_number: string;
  receiver_number: string;
  content: string;
  message_type: string;
  status: 'sent' | 'delivered' | 'read' | 'failed';
  media_url: string | null;
  processed_by: string | null;
  sent_at: string;
  delivered_at: string | null;
  read_at: string | null;
  created_at: string;
}

export const MessagesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Real data from database
  const { messages, loading, error } = useMessages();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'read': return 'bg-green-100 text-green-800 border-green-200';
      case 'delivered': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'sent': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'failed': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'read': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'delivered': return <Send className="h-4 w-4 text-blue-600" />;
      case 'sent': return <Send className="h-4 w-4 text-yellow-600" />;
      case 'failed': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default: return <MessageSquare className="h-4 w-4" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'read': return 'Lida';
      case 'delivered': return 'Entregue';
      case 'sent': return 'Enviada';
      case 'failed': return 'Falhou';
      default: return status;
    }
  };

  const filteredMessages = messages
    .filter(message => 
      message.sender_number.includes(searchTerm) ||
      message.receiver_number.includes(searchTerm) ||
      message.content.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(message => filterStatus === 'all' || message.status === filterStatus);

  const messageStats = {
    total: filteredMessages.length,
    read: filteredMessages.filter(m => m.status === 'read').length,
    delivered: filteredMessages.filter(m => m.status === 'delivered').length,
    sent: filteredMessages.filter(m => m.status === 'sent').length,
    failed: filteredMessages.filter(m => m.status === 'failed').length
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Mensagens</h1>
          <p className="text-muted-foreground mt-1">
            Monitore conversas e interações automáticas
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-2">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-2xl font-bold text-foreground">{messageStats.total}</p>
                <p className="text-sm text-muted-foreground">Total</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-2">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-2xl font-bold text-foreground">{messageStats.read}</p>
                <p className="text-sm text-muted-foreground">Lidas</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-2">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Send className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-2xl font-bold text-foreground">{messageStats.delivered}</p>
                <p className="text-sm text-muted-foreground">Entregues</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-2">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-2xl font-bold text-foreground">{messageStats.failed}</p>
                <p className="text-sm text-muted-foreground">Falhadas</p>
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
                  placeholder="Buscar por número ou conteúdo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Status</SelectItem>
                <SelectItem value="read">Lida</SelectItem>
                <SelectItem value="delivered">Entregue</SelectItem>
                <SelectItem value="sent">Enviada</SelectItem>
                <SelectItem value="failed">Falhada</SelectItem>
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
            <p className="text-muted-foreground">Carregando mensagens...</p>
          </CardContent>
        </Card>
      )}

      {/* Error State */}
      {error && (
        <Card className="border-2">
          <CardContent className="p-12 text-center">
            <MessageSquare className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Erro ao carregar mensagens</h3>
            <p className="text-muted-foreground mb-4">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Messages List */}
      {!loading && !error && (
        <div className="space-y-4">
          {filteredMessages.map((message) => (
          <Card key={message.id} className="border-2 hover:shadow-card transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(message.status)}
                      <h3 className="font-semibold text-foreground text-lg">{message.sender_number}</h3>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {message.id}
                    </Badge>
                    <Badge variant="outline" className={`text-xs border ${getStatusColor(message.status)}`}>
                      {getStatusLabel(message.status)}
                    </Badge>
                  </div>
                  
                  <div className="bg-muted/30 rounded-lg p-3 mb-3">
                    <p className="text-foreground">{message.content}</p>
                  </div>
                  
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-3">
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      <span>Para: {message.receiver_number}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(message.sent_at).toLocaleString('pt-BR')}</span>
                    </div>
                    <div>
                      <span className="font-medium">Tipo:</span> {message.message_type}
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {message.media_url && (
                      <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200">
                        📎 Mídia
                      </Badge>
                    )}
                    {message.processed_by && (
                      <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                        👤 Processado
                      </Badge>
                    )}
                  </div>
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Ver Detalhes
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardContent>
          </Card>
          ))}
        </div>
      )}

      {!loading && !error && filteredMessages.length === 0 && (
        <Card className="border-2">
          <CardContent className="p-12 text-center">
            <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Nenhuma mensagem encontrada</h3>
            <p className="text-muted-foreground">
              {searchTerm || filterStatus !== 'all' 
                ? 'Nenhuma mensagem encontrada com os filtros aplicados.'
                : 'Nenhuma mensagem registada ainda.'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};