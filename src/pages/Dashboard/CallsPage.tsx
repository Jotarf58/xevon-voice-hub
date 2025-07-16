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
  Play,
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
  caller_number: string;
  receiver_number: string;
  status: 'active' | 'completed' | 'missed' | 'failed';
  duration: number | null;
  started_at: string;
  ended_at: string | null;
  handled_by: string | null;
  notes: string | null;
  recording_url: string | null;
  created_at: string;
}

export const CallsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Mock data - will be replaced with real data from database
  const [calls] = useState<CallRecord[]>([]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'active': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'failed': return 'bg-red-100 text-red-800 border-red-200';
      case 'missed': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <PhoneCall className="h-4 w-4 text-green-600" />;
      case 'active': return <Play className="h-4 w-4 text-blue-600" />;
      case 'failed': return <PhoneOff className="h-4 w-4 text-red-600" />;
      case 'missed': return <Phone className="h-4 w-4 text-yellow-600" />;
      default: return <Phone className="h-4 w-4" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed': return 'Concluída';
      case 'active': return 'Em Andamento';
      case 'failed': return 'Falhada';
      case 'missed': return 'Perdida';
      default: return status;
    }
  };

  const filteredCalls = calls
    .filter(call => 
      call.caller_number.includes(searchTerm) ||
      call.receiver_number.includes(searchTerm) ||
      call.id.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(call => filterStatus === 'all' || call.status === filterStatus);

  const callStats = {
    total: filteredCalls.length,
    completed: filteredCalls.filter(c => c.status === 'completed').length,
    active: filteredCalls.filter(c => c.status === 'active').length,
    failed: filteredCalls.filter(c => c.status === 'failed').length,
    missed: filteredCalls.filter(c => c.status === 'missed').length
  };

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
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                <p className="text-2xl font-bold text-foreground">{callStats.failed}</p>
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
                  placeholder="Buscar por número..."
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
                <SelectItem value="failed">Falhada</SelectItem>
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
                      <h3 className="font-semibold text-foreground text-lg">{call.caller_number}</h3>
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
                      <span className="font-medium">Para:</span> {call.receiver_number}
                    </div>
                    <div>
                      <span className="font-medium">Duração:</span> {call.duration ? `${call.duration}s` : 'N/A'}
                    </div>
                    <div>
                      <span className="font-medium">Início:</span> {new Date(call.started_at).toLocaleString('pt-BR')}
                    </div>
                    {call.ended_at && (
                      <div>
                        <span className="font-medium">Fim:</span> {new Date(call.ended_at).toLocaleString('pt-BR')}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {call.recording_url && (
                      <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200">
                        🎧 Gravação Disponível
                      </Badge>
                    )}
                    {call.notes && (
                      <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                        📝 Notas
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
              Conecte os dados da base de dados para ver as chamadas.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};