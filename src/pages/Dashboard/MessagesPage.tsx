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
  phoneNumber: string;
  contact: string;
  status: 'delivered' | 'sending' | 'failed' | 'read';
  direction: 'inbound' | 'outbound';
  content: string;
  timestamp: string;
  messageType: 'text' | 'template' | 'media';
  conversationId: string;
  aiProcessed: boolean;
  convertedToTicket?: string;
  errorMessage?: string;
  templateName?: string;
}

export const MessagesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
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
  const [filterDirection, setFilterDirection] = useState('all');

  // Mock data - would come from WhatsApp/Twilio webhooks in real app
  const [messages] = useState<Message[]>([
    {
      id: 'MSG-001',
      phoneNumber: '+351912345678',
      contact: 'João Silva',
      status: 'read',
      direction: 'inbound',
      content: 'Olá, tenho um problema com o meu pedido',
      timestamp: '2024-01-13T11:45:00Z',
      messageType: 'text',
      conversationId: 'CONV-001',
      aiProcessed: true,
      convertedToTicket: 'TK-006'
    },
    {
      id: 'MSG-002',
      phoneNumber: '+351912345678',
      contact: 'João Silva',
      status: 'delivered',
      direction: 'outbound',
      content: 'Olá João! Compreendo a sua situação. Vou criar um ticket para resolver o seu problema rapidamente.',
      timestamp: '2024-01-13T11:46:30Z',
      messageType: 'text',
      conversationId: 'CONV-001',
      aiProcessed: true
    },
    {
      id: 'MSG-003',
      phoneNumber: '+351987654321',
      contact: 'Maria Santos',
      status: 'sending',
      direction: 'outbound',
      content: 'A sua consulta foi agendada para amanhã às 14h30.',
      timestamp: '2024-01-13T11:30:00Z',
      messageType: 'template',
      conversationId: 'CONV-002',
      aiProcessed: false,
      templateName: 'appointment_confirmation'
    },
    {
      id: 'MSG-004',
      phoneNumber: '+351555123456',
      contact: 'Pedro Costa',
      status: 'failed',
      direction: 'outbound',
      content: 'Tentativa de envio de notificação',
      timestamp: '2024-01-13T10:15:00Z',
      messageType: 'template',
      conversationId: 'CONV-003',
      aiProcessed: false,
      errorMessage: 'Template not found - invalid template name'
    },
    {
      id: 'MSG-005',
      phoneNumber: '+351666789012',
      contact: 'Ana Rodrigues',
      status: 'delivered',
      direction: 'inbound',
      content: 'Quando é que posso esperar uma resposta?',
      timestamp: '2024-01-13T09:30:00Z',
      messageType: 'text',
      conversationId: 'CONV-004',
      aiProcessed: true
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800 border-green-200';
      case 'read': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'sending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'failed': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'read': return <CheckCircle className="h-4 w-4 text-blue-600" />;
      case 'sending': return <Send className="h-4 w-4 text-yellow-600" />;
      case 'failed': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default: return <MessageSquare className="h-4 w-4" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'delivered': return 'Entregue';
      case 'read': return 'Lida';
      case 'sending': return 'Enviando';
      case 'failed': return 'Falhou';
      default: return status;
    }
  };

  const getDirectionLabel = (direction: string) => {
    return direction === 'inbound' ? 'Recebida' : 'Enviada';
  };

  const getMessageTypeIcon = (type: string) => {
    switch (type) {
      case 'template': return '📋';
      case 'media': return '📎';
      default: return '💬';
    }
  };

  const filteredMessages = messages
    .filter(message => 
      message.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.phoneNumber.includes(searchTerm) ||
      message.content.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(message => filterStatus === 'all' || message.status === filterStatus)
    .filter(message => filterDirection === 'all' || message.direction === filterDirection);

  const messageStats = {
    total: filteredMessages.length,
    delivered: filteredMessages.filter(m => m.status === 'delivered').length,
    read: filteredMessages.filter(m => m.status === 'read').length,
    sending: filteredMessages.filter(m => m.status === 'sending').length,
    failed: filteredMessages.filter(m => m.status === 'failed').length
  };

  const activeChats = [...new Set(filteredMessages.map(m => m.conversationId))].length;

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
          {activeChats} conversas ativas
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
                <p className="text-2xl font-bold text-foreground">{messageStats.delivered}</p>
                <p className="text-sm text-muted-foreground">Entregues</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-2">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-blue-500" />
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
              <Send className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-2xl font-bold text-foreground">{messageStats.sending}</p>
                <p className="text-sm text-muted-foreground">Enviando</p>
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
                <p className="text-sm text-muted-foreground">Falharam</p>
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
                  placeholder="Buscar por contato, número ou conteúdo..."
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
                <SelectItem value="delivered">Entregue</SelectItem>
                <SelectItem value="read">Lida</SelectItem>
                <SelectItem value="sending">Enviando</SelectItem>
                <SelectItem value="failed">Falhou</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterDirection} onValueChange={setFilterDirection}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Direção" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="inbound">Recebidas</SelectItem>
                <SelectItem value="outbound">Enviadas</SelectItem>
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
                      <h3 className="font-semibold text-foreground text-lg">
                        {message.contact}
                      </h3>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {message.id}
                    </Badge>
                    <Badge variant="outline" className={`text-xs border ${getStatusColor(message.status)}`}>
                      {getStatusLabel(message.status)}
                    </Badge>
                    <Badge variant={message.direction === 'inbound' ? 'default' : 'secondary'} className="text-xs">
                      {getDirectionLabel(message.direction)}
                    </Badge>
                    <span className="text-lg">{getMessageTypeIcon(message.messageType)}</span>
                  </div>
                  
                  <div className="bg-muted/30 rounded-lg p-3 mb-3">
                    <p className="text-foreground">{message.content}</p>
                  </div>
                  
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-3">
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      <span>{message.phoneNumber}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(message.timestamp).toLocaleString('pt-BR')}</span>
                    </div>
                    <div>
                      <span className="font-medium">Conversa:</span> {message.conversationId}
                    </div>
                    {message.templateName && (
                      <div>
                        <span className="font-medium">Template:</span> {message.templateName}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {message.aiProcessed && (
                      <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                        🤖 Processada por IA
                      </Badge>
                    )}
                    {message.convertedToTicket && (
                      <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                        📋 Ticket: {message.convertedToTicket}
                      </Badge>
                    )}
                    {message.errorMessage && (
                      <Badge variant="outline" className="text-xs bg-red-50 text-red-700 border-red-200">
                        ⚠️ {message.errorMessage}
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
                      Ver Conversa
                    </DropdownMenuItem>
                    {message.direction === 'inbound' && !message.convertedToTicket && (
                      <DropdownMenuItem>
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