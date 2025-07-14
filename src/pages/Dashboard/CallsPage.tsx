import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Phone, 
  PhoneCall, 
  PhoneOff,
  Search, 
  Clock,
  AlertTriangle,
  Play,
  Pause,
  MoreHorizontal,
  FileText,
  ArrowUpRight
} from 'lucide-react';
import { CallDetailsDialog } from '@/components/Dialogs/CallDetailsDialog';
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

interface CallRecord {
  id: string;
  customerName: string;
  customerPhone: string;
  status: 'incoming' | 'active' | 'completed' | 'missed' | 'error';
  duration: string;
  startTime: string;
  endTime?: string;
  location: string;
  twilioSid: string;
  recordingUrl?: string;
  aiAnalysis?: string;
  elevenlabsVoice?: string;
}

export const CallsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedCall, setSelectedCall] = useState<CallRecord | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [ticketFormOpen, setTicketFormOpen] = useState(false);

  const handleEdit = (call: CallRecord) => {
    console.log('Edit call:', call);
  };

  const handleDelete = (callId: string) => {
    console.log('Delete call:', callId);
  };

  const handleConvertToTicket = (call: CallRecord) => {
    setTicketFormOpen(true);
  };

  const handleTicketSave = (ticketData: any) => {
    console.log('Save ticket from call:', ticketData);
    setTicketFormOpen(false);
  };

  const [calls, setCalls] = useState<CallRecord[]>([
    {
      id: 'call-001',
      customerName: 'João Silva',
      customerPhone: '+351 912 345 678',
      status: 'completed',
      duration: '5:23',
      startTime: '2024-01-13T10:30:00Z',
      endTime: '2024-01-13T10:35:23Z',
      location: 'Lisboa',
      twilioSid: 'CA1234567890abcdef',
      recordingUrl: 'https://api.twilio.com/recordings/RE123',
      aiAnalysis: 'Cliente satisfeito com a resolução do problema técnico.',
      elevenlabsVoice: 'João - Voz Natural PT'
    },
    {
      id: 'call-002',
      customerName: 'Maria Santos',
      customerPhone: '+351 963 789 012',
      status: 'active',
      duration: '2:45',
      startTime: '2024-01-13T11:15:00Z',
      location: 'Porto',
      twilioSid: 'CA1234567890abcdefg',
      elevenlabsVoice: 'Maria - Voz Feminina PT'
    },
    {
      id: 'call-003',
      customerName: 'Pedro Costa',
      customerPhone: '+351 934 567 890',
      status: 'missed',
      duration: '0:00',
      startTime: '2024-01-13T09:45:00Z',
      location: 'Coimbra',
      twilioSid: 'CA1234567890abcdefh'
    },
    {
      id: 'call-004',
      customerName: 'Ana Rodrigues',
      customerPhone: '+351 987 654 321',
      status: 'error',
      duration: '1:12',
      startTime: '2024-01-13T08:30:00Z',
      location: 'Braga',
      twilioSid: 'CA1234567890abcdefi',
      aiAnalysis: 'Erro na conexão durante a chamada.'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'active': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'error': return 'bg-red-100 text-red-800 border-red-200';
      case 'missed': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <PhoneCall className="h-4 w-4 text-green-600" />;
      case 'active': return <Play className="h-4 w-4 text-blue-600" />;
      case 'error': return <PhoneOff className="h-4 w-4 text-red-600" />;
      case 'missed': return <Phone className="h-4 w-4 text-yellow-600" />;
      default: return <Phone className="h-4 w-4" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed': return 'Concluída';
      case 'active': return 'Em Andamento';
      case 'error': return 'Erro';
      case 'missed': return 'Perdida';
      default: return status;
    }
  };

  const filteredCalls = calls
    .filter(call => 
      call.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      call.customerPhone.includes(searchTerm) ||
      call.twilioSid.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(call => filterStatus === 'all' || call.status === filterStatus);

  const callStats = {
    total: filteredCalls.length,
    completed: filteredCalls.filter(c => c.status === 'completed').length,
    active: filteredCalls.filter(c => c.status === 'active').length,
    error: filteredCalls.filter(c => c.status === 'error').length,
    missed: filteredCalls.filter(c => c.status === 'missed').length
  };

  const liveCalls = filteredCalls.filter(c => c.status === 'active');

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Chamadas</h1>
          <p className="text-muted-foreground mt-1">
            Monitore chamadas em tempo real e histórico de conversas
          </p>
        </div>
        {liveCalls.length > 0 && (
          <Badge className="bg-gradient-primary text-primary-foreground animate-pulse">
            {liveCalls.length} chamada(s) ao vivo
          </Badge>
        )}
      </div>

      {/* Live Calls Section */}
      {liveCalls.length > 0 && (
        <Card className="border-2 border-blue-200 bg-blue-50/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Play className="h-5 w-5 text-blue-600 animate-pulse" />
              <h2 className="text-xl font-semibold text-foreground">Chamadas ao Vivo</h2>
            </div>
            <div className="space-y-3">
              {liveCalls.map((call) => (
                <div key={call.id} className="flex items-center justify-between p-4 bg-white rounded-lg border border-blue-200">
                  <div className="flex items-center gap-4">
                    <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
                    <div>
                      <p className="font-medium text-foreground">{call.customerName}</p>
                      <p className="text-sm text-muted-foreground">
                        {call.customerPhone} • {new Date(call.startTime).toLocaleTimeString('pt-BR')}
                      </p>
                    </div>
                    {call.elevenlabsVoice && (
                      <Badge variant="outline" className="text-xs">
                        🤖 IA Ativa
                      </Badge>
                    )}
                  </div>
                  <Button variant="outline" size="sm" onClick={() => {
                    setSelectedCall(call);
                    setDetailsOpen(true);
                  }}>
                    <ArrowUpRight className="h-4 w-4 mr-2" />
                    Monitorar
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="border-2">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Phone className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-2xl font-bold text-foreground">{callStats.total}</p>
                <p className="text-sm text-muted-foreground">Total</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-2">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <PhoneCall className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-2xl font-bold text-foreground">{callStats.completed}</p>
                <p className="text-sm text-muted-foreground">Concluídas</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-2">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Play className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-2xl font-bold text-foreground">{callStats.active}</p>
                <p className="text-sm text-muted-foreground">Em Andamento</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-2">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <PhoneOff className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-2xl font-bold text-foreground">{callStats.error}</p>
                <p className="text-sm text-muted-foreground">Erro</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-2">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-2xl font-bold text-foreground">{callStats.missed}</p>
                <p className="text-sm text-muted-foreground">Perdidas</p>
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
                  placeholder="Buscar por nome, número ou Twilio SID..."
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
                <SelectItem value="completed">Concluída</SelectItem>
                <SelectItem value="active">Em Andamento</SelectItem>
                <SelectItem value="error">Erro</SelectItem>
                <SelectItem value="missed">Perdida</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Calls List */}
      <div className="space-y-4">
        {filteredCalls.map((call) => (
          <Card key={call.id} className="border-2 hover:shadow-card transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(call.status)}
                      <h3 className="font-semibold text-foreground text-lg">{call.customerName}</h3>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {call.id}
                    </Badge>
                    <Badge variant="outline" className={`text-xs border ${getStatusColor(call.status)}`}>
                      {getStatusLabel(call.status)}
                    </Badge>
                  </div>
                  
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-3">
                    <div>
                      <span className="font-medium">Telefone:</span> {call.customerPhone}
                    </div>
                    <div>
                      <span className="font-medium">Duração:</span> {call.duration}
                    </div>
                    <div>
                      <span className="font-medium">Início:</span> {new Date(call.startTime).toLocaleString('pt-BR')}
                    </div>
                    <div>
                      <span className="font-medium">Local:</span> {call.location}
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {call.elevenlabsVoice && (
                      <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                        🤖 {call.elevenlabsVoice}
                      </Badge>
                    )}
                    {call.recordingUrl && (
                      <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200">
                        🎧 Gravação Disponível
                      </Badge>
                    )}
                    {call.aiAnalysis && (
                      <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                        📊 Análise IA
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
                    <DropdownMenuItem onClick={() => {
                      setSelectedCall(call);
                      setDetailsOpen(true);
                    }}>
                      <FileText className="mr-2 h-4 w-4" />
                      Ver Detalhes
                    </DropdownMenuItem>
                    {call.status === 'completed' && (
                      <DropdownMenuItem onClick={() => handleConvertToTicket(call)}>
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

      {filteredCalls.length === 0 && (
        <Card className="border-2">
          <CardContent className="p-12 text-center">
            <Phone className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Nenhuma chamada encontrada</h3>
            <p className="text-muted-foreground">
              Não há chamadas que correspondam aos seus critérios de busca.
            </p>
          </CardContent>
        </Card>
      )}

      <CallDetailsDialog
        call={selectedCall}
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