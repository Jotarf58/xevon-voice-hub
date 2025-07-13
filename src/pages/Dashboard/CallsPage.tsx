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
  phoneNumber: string;
  direction: 'inbound' | 'outbound';
  status: 'completed' | 'in_progress' | 'failed' | 'missed';
  duration: number; // in seconds
  startTime: string;
  endTime?: string;
  twilioSid: string;
  aiUsed: boolean;
  voiceSynthesis?: string;
  convertedToTicket?: string;
  errorMessage?: string;
}

export const CallsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDirection, setFilterDirection] = useState('all');

  // Mock data - would come from Twilio webhooks in real app
  const [calls] = useState<CallRecord[]>([
    {
      id: 'CALL-001',
      phoneNumber: '+351912345678',
      direction: 'inbound',
      status: 'in_progress',
      duration: 0,
      startTime: '2024-01-13T11:30:00Z',
      twilioSid: 'CA1234567890abcdef',
      aiUsed: true,
      voiceSynthesis: 'ElevenLabs - Voice ID: Rachel'
    },
    {
      id: 'CALL-002',
      phoneNumber: '+351987654321',
      direction: 'inbound',
      status: 'completed',
      duration: 245,
      startTime: '2024-01-13T10:15:00Z',
      endTime: '2024-01-13T10:19:05Z',
      twilioSid: 'CA0987654321fedcba',
      aiUsed: true,
      voiceSynthesis: 'ElevenLabs - Voice ID: Adam',
      convertedToTicket: 'TK-005'
    },
    {
      id: 'CALL-003',
      phoneNumber: '+351555123456',
      direction: 'outbound',
      status: 'failed',
      duration: 0,
      startTime: '2024-01-13T09:45:00Z',
      twilioSid: 'CA5555123456789abc',
      aiUsed: false,
      errorMessage: 'Connection timeout - carrier not responding'
    },
    {
      id: 'CALL-004',
      phoneNumber: '+351666789012',
      direction: 'inbound',
      status: 'missed',
      duration: 0,
      startTime: '2024-01-13T08:20:00Z',
      twilioSid: 'CA6667890123456def',
      aiUsed: false
    },
    {
      id: 'CALL-005',
      phoneNumber: '+351777890123',
      direction: 'inbound',
      status: 'completed',
      duration: 412,
      startTime: '2024-01-12T16:30:00Z',
      endTime: '2024-01-12T16:37:22Z',
      twilioSid: 'CA7778901234567890',
      aiUsed: true,
      voiceSynthesis: 'ElevenLabs - Voice ID: Bella'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'in_progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'failed': return 'bg-red-100 text-red-800 border-red-200';
      case 'missed': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <PhoneCall className="h-4 w-4 text-green-600" />;
      case 'in_progress': return <Play className="h-4 w-4 text-blue-600" />;
      case 'failed': return <PhoneOff className="h-4 w-4 text-red-600" />;
      case 'missed': return <Phone className="h-4 w-4 text-yellow-600" />;
      default: return <Phone className="h-4 w-4" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed': return 'Concluída';
      case 'in_progress': return 'Em Andamento';
      case 'failed': return 'Falhou';
      case 'missed': return 'Perdida';
      default: return status;
    }
  };

  const getDirectionLabel = (direction: string) => {
    return direction === 'inbound' ? 'Recebida' : 'Efetuada';
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const filteredCalls = calls
    .filter(call => 
      call.phoneNumber.includes(searchTerm) ||
      call.twilioSid.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(call => filterStatus === 'all' || call.status === filterStatus)
    .filter(call => filterDirection === 'all' || call.direction === filterDirection);

  const callStats = {
    total: filteredCalls.length,
    completed: filteredCalls.filter(c => c.status === 'completed').length,
    inProgress: filteredCalls.filter(c => c.status === 'in_progress').length,
    failed: filteredCalls.filter(c => c.status === 'failed').length,
    missed: filteredCalls.filter(c => c.status === 'missed').length
  };

  const liveCalls = filteredCalls.filter(c => c.status === 'in_progress');

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
                      <p className="font-medium text-foreground">{call.phoneNumber}</p>
                      <p className="text-sm text-muted-foreground">
                        Iniciada: {new Date(call.startTime).toLocaleTimeString('pt-BR')}
                      </p>
                    </div>
                    {call.aiUsed && (
                      <Badge variant="outline" className="text-xs">
                        🤖 IA Ativa
                      </Badge>
                    )}
                  </div>
                  <Button variant="outline" size="sm">
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
                <p className="text-2xl font-bold text-foreground">{callStats.inProgress}</p>
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
                <p className="text-2xl font-bold text-foreground">{callStats.failed}</p>
                <p className="text-sm text-muted-foreground">Falharam</p>
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
                  placeholder="Buscar por número ou Twilio SID..."
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
                <SelectItem value="in_progress">Em Andamento</SelectItem>
                <SelectItem value="failed">Falhou</SelectItem>
                <SelectItem value="missed">Perdida</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterDirection} onValueChange={setFilterDirection}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Direção" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="inbound">Recebidas</SelectItem>
                <SelectItem value="outbound">Efetuadas</SelectItem>
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
                      <h3 className="font-semibold text-foreground text-lg">{call.phoneNumber}</h3>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {call.id}
                    </Badge>
                    <Badge variant="outline" className={`text-xs border ${getStatusColor(call.status)}`}>
                      {getStatusLabel(call.status)}
                    </Badge>
                    <Badge variant={call.direction === 'inbound' ? 'default' : 'secondary'} className="text-xs">
                      {getDirectionLabel(call.direction)}
                    </Badge>
                  </div>
                  
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-3">
                    <div>
                      <span className="font-medium">Duração:</span> {formatDuration(call.duration)}
                    </div>
                    <div>
                      <span className="font-medium">Início:</span> {new Date(call.startTime).toLocaleString('pt-BR')}
                    </div>
                    {call.endTime && (
                      <div>
                        <span className="font-medium">Fim:</span> {new Date(call.endTime).toLocaleString('pt-BR')}
                      </div>
                    )}
                    <div>
                      <span className="font-medium">Twilio SID:</span> {call.twilioSid}
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {call.aiUsed && (
                      <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                        🤖 IA Utilizada
                      </Badge>
                    )}
                    {call.voiceSynthesis && (
                      <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200">
                        🎤 {call.voiceSynthesis}
                      </Badge>
                    )}
                    {call.convertedToTicket && (
                      <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                        📋 Ticket: {call.convertedToTicket}
                      </Badge>
                    )}
                    {call.errorMessage && (
                      <Badge variant="outline" className="text-xs bg-red-50 text-red-700 border-red-200">
                        ⚠️ {call.errorMessage}
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
                      <FileText className="mr-2 h-4 w-4" />
                      Ver Detalhes
                    </DropdownMenuItem>
                    {call.status === 'completed' && !call.convertedToTicket && (
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