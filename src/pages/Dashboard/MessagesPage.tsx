import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  MessageSquare, 
  Send,
  AlertTriangle,
  Search, 
  Clock,
  CheckCircle,
  MoreHorizontal,
  ArrowUpRight,
  User,
  Calendar
} from 'lucide-react';
import { MessageDetailsDialog } from '@/components/Dialogs/MessageDetailsDialog';
import { TicketFormDialog } from '@/components/Dialogs/TicketFormDialog';
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
  customerName: string;
  customerPhone: string;
  platform: 'whatsapp' | 'telegram' | 'sms';
  status: 'received' | 'processing' | 'responded' | 'error' | 'pending';
  lastMessage: string;
  messageCount: number;
  timestamp: string;
  assignedAgent?: string;
  isAiHandled: boolean;
  aiConfidence?: number;
  customerSatisfaction?: number;
  tags: string[];
}

export const MessagesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPlatform, setFilterPlatform] = useState('all');
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [ticketFormOpen, setTicketFormOpen] = useState(false);

  const handleEdit = (message: Message) => {
    console.log('Edit message:', message);
  };

  const handleDelete = (messageId: string) => {
    console.log('Delete message:', messageId);
  };

  const handleConvertToTicket = (message: Message) => {
    setTicketFormOpen(true);
  };

  const handleTicketSave = (ticketData: any) => {
    console.log('Save ticket from message:', ticketData);
    setTicketFormOpen(false);
  };

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg-001',
      customerName: 'Carlos Pereira',
      customerPhone: '+351 912 345 678',
      platform: 'whatsapp',
      status: 'responded',
      lastMessage: 'Obrigado pela ajuda! Problema resolvido.',
      messageCount: 8,
      timestamp: '2024-01-13T14:30:00Z',
      assignedAgent: 'João Silva',
      isAiHandled: false,
      customerSatisfaction: 5,
      tags: ['resolvido', 'satisfeito']
    },
    {
      id: 'msg-002',
      customerName: 'Sofia Martins',
      customerPhone: '+351 963 789 012',
      platform: 'whatsapp',
      status: 'processing',
      lastMessage: 'Preciso de ajuda com a configuração do sistema...',
      messageCount: 3,
      timestamp: '2024-01-13T13:45:00Z',
      isAiHandled: true,
      aiConfidence: 85,
      tags: ['configuracao', 'sistema']
    },
    {
      id: 'msg-003',
      customerName: 'Ricardo Oliveira',
      customerPhone: '+351 934 567 890',
      platform: 'telegram',
      status: 'pending',
      lastMessage: 'Quando será resolvido o meu pedido?',
      messageCount: 2,
      timestamp: '2024-01-13T12:20:00Z',
      isAiHandled: false,
      tags: ['pendente', 'seguimento']
    },
    {
      id: 'msg-004',
      customerName: 'Beatriz Costa',
      customerPhone: '+351 987 654 321',
      platform: 'sms',
      status: 'error',
      lastMessage: 'Não consigo aceder à plataforma',
      messageCount: 1,
      timestamp: '2024-01-13T11:10:00Z',
      isAiHandled: true,
      aiConfidence: 45,
      tags: ['erro', 'acesso']
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'responded': return 'bg-green-100 text-green-800 border-green-200';
      case 'processing': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'error': return 'bg-red-100 text-red-800 border-red-200';
      case 'received': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'responded': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'processing': return <Clock className="h-4 w-4 text-blue-600" />;
      case 'pending': return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'error': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'received': return <MessageSquare className="h-4 w-4 text-purple-600" />;
      default: return <MessageSquare className="h-4 w-4" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'responded': return 'Respondida';
      case 'processing': return 'Processando';
      case 'pending': return 'Pendente';
      case 'error': return 'Erro';
      case 'received': return 'Recebida';
      default: return status;
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'whatsapp': return '📱';
      case 'telegram': return '✈️';
      case 'sms': return '💬';
      default: return '📧';
    }
  };

  const filteredMessages = messages
    .filter(message => 
      message.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.customerPhone.includes(searchTerm) ||
      message.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(message => filterStatus === 'all' || message.status === filterStatus)
    .filter(message => filterPlatform === 'all' || message.platform === filterPlatform);

  const messageStats = {
    total: filteredMessages.length,
    responded: filteredMessages.filter(m => m.status === 'responded').length,
    processing: filteredMessages.filter(m => m.status === 'processing').length,
    pending: filteredMessages.filter(m => m.status === 'pending').length,
    error: filteredMessages.filter(m => m.status === 'error').length
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Mensagens</h1>
          <p className="text-muted-foreground mt-1">
            Monitore conversas WhatsApp e interações automáticas
          </p>
        </div>
        <Badge variant="outline" className="text-sm px-3 py-1">
          {messageStats.total} conversas
        </Badge>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
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
                <p className="text-2xl font-bold text-foreground">{messageStats.responded}</p>
                <p className="text-sm text-muted-foreground">Respondidas</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-2">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-2xl font-bold text-foreground">{messageStats.processing}</p>
                <p className="text-sm text-muted-foreground">Processando</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-2">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-2xl font-bold text-foreground">{messageStats.pending}</p>
                <p className="text-sm text-muted-foreground">Pendentes</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-2">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-2xl font-bold text-foreground">{messageStats.error}</p>
                <p className="text-sm text-muted-foreground">Erro</p>
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
                  placeholder="Buscar por cliente, número ou conteúdo..."
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
                <SelectItem value="responded">Respondida</SelectItem>
                <SelectItem value="processing">Processando</SelectItem>
                <SelectItem value="pending">Pendente</SelectItem>
                <SelectItem value="error">Erro</SelectItem>
                <SelectItem value="received">Recebida</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterPlatform} onValueChange={setFilterPlatform}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Plataforma" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="whatsapp">WhatsApp</SelectItem>
                <SelectItem value="telegram">Telegram</SelectItem>
                <SelectItem value="sms">SMS</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Messages List */}
      <div className="space-y-4">
        {filteredMessages.map((message) => (
          <Card key={message.id} className="border-2 hover:shadow-card transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(message.status)}
                      <h3 className="font-semibold text-foreground text-lg">{message.customerName}</h3>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {message.id}
                    </Badge>
                    <Badge variant="outline" className={`text-xs border ${getStatusColor(message.status)}`}>
                      {getStatusLabel(message.status)}
                    </Badge>
                    <span className="text-lg">{getPlatformIcon(message.platform)}</span>
                  </div>
                  
                  <div className="bg-muted/30 rounded-lg p-3 mb-3">
                    <p className="text-foreground">{message.lastMessage}</p>
                  </div>
                  
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-3">
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      <span>{message.customerPhone}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(message.timestamp).toLocaleString('pt-BR')}</span>
                    </div>
                    <div>
                      <span className="font-medium">Mensagens:</span> {message.messageCount}
                    </div>
                    {message.assignedAgent && (
                      <div>
                        <span className="font-medium">Agente:</span> {message.assignedAgent}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {message.isAiHandled && (
                      <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                        🤖 IA {message.aiConfidence && `(${message.aiConfidence}%)`}
                      </Badge>
                    )}
                    {message.customerSatisfaction && (
                      <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                        ⭐ Satisfação: {message.customerSatisfaction}/5
                      </Badge>
                    )}
                    {message.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => {
                      setSelectedMessage(message);
                      setDetailsOpen(true);
                    }}>
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Ver Conversa
                    </DropdownMenuItem>
                    {message.status !== 'responded' && (
                      <DropdownMenuItem onClick={() => handleConvertToTicket(message)}>
                        <ArrowUpRight className="mr-2 h-4 w-4" />
                        Converter em Ticket
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredMessages.length === 0 && (
        <Card className="border-2">
          <CardContent className="p-12 text-center">
            <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Nenhuma mensagem encontrada</h3>
            <p className="text-muted-foreground">
              Não há mensagens que correspondam aos seus critérios de busca.
            </p>
          </CardContent>
        </Card>
      )}

      <MessageDetailsDialog
        message={selectedMessage}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onConvertToTicket={handleConvertToTicket}
      />

      <TicketFormDialog
        open={ticketFormOpen}
        onOpenChange={setTicketFormOpen}
        onSave={handleTicketSave}
      />
    </div>
  );
};