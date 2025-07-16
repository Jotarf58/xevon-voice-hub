import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTasks, useTaskOperations } from '@/hooks/useSupabaseData';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Search, 
  CheckSquare, 
  Clock,
  User,
  Calendar,
  MoreHorizontal,
  Edit,
  CheckCircle,
  AlertCircle
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
import { TaskFormDialog } from '@/components/Dialogs/TaskFormDialog';
import { TaskDetailsDialog } from '@/components/Dialogs/TaskDetailsDialog';
import { useToast } from '@/hooks/use-toast';

interface Task {
  id: string;
  title: string;
  description: string | null;
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  assignee_id: string | null;
  assignee?: { name: string; email: string } | null;
  team: 'technical' | 'support' | 'sales' | 'management';
  category: string;
  due_date: string | null;
  created_by: string;
  creator?: { name: string; email: string } | null;
  created_at: string;
  updated_at: string;
}

export const TasksPage: React.FC = () => {
  const { user } = useAuth();
  const { tasks, loading, error, refetch } = useTasks();
  const { createTask, updateTask, completeTask } = useTaskOperations();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);

  // Funções de manipulação
  const handleCreateTask = () => {
    setSelectedTask(null);
    setIsFormOpen(true);
  };

  const handleEditTask = (task: any) => {
    setSelectedTask(task);
    setIsFormOpen(true);
  };

  const handleViewTask = (task: any) => {
    setSelectedTask(task);
    setIsDetailsOpen(true);
  };

  const handleSaveTask = async (taskData: any) => {
    try {
      if (selectedTask) {
        await updateTask(selectedTask.id, taskData);
        toast({
          title: "Sucesso",
          description: "Tarefa atualizada com sucesso!",
        });
      } else {
        await createTask(taskData);
        toast({
          title: "Sucesso",
          description: "Tarefa criada com sucesso!",
        });
      }
      refetch();
      setSelectedTask(null);
      setIsFormOpen(false);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao salvar tarefa. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleCompleteTask = async (taskId: string) => {
    try {
      await completeTask(taskId);
      toast({
        title: "Sucesso",
        description: "Tarefa marcada como concluída!",
      });
      refetch();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao completar tarefa. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500 text-white';
      case 'in_progress': return 'bg-blue-500 text-white';
      case 'pending': return 'bg-yellow-500 text-black';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'Pendente';
      case 'in_progress': return 'Em Progresso';
      case 'completed': return 'Concluída';
      default: return status;
    }
  };

  const canViewTask = (task: Task) => {
    if (user?.role === 'developer') return true;
    if (user?.role === 'manager' && task.team === user.team) return true;
    if (task.assignee_id === user?.id) return true;
    return false;
  };

  const filteredTasks = tasks
    .filter(canViewTask)
    .filter(task => 
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .filter(task => filterStatus === 'all' || task.status === filterStatus)
    .filter(task => filterCategory === 'all' || task.category === filterCategory);

  const taskStats = {
    total: filteredTasks.length,
    pending: filteredTasks.filter(t => t.status === 'pending').length,
    inProgress: filteredTasks.filter(t => t.status === 'in_progress').length,
    completed: filteredTasks.filter(t => t.status === 'completed').length
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Tarefas</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie suas tarefas e acompanhe o progresso da equipe
          </p>
        </div>
        <Button 
          className="bg-gradient-primary hover:bg-gradient-primary/90"
          onClick={handleCreateTask}
        >
          <Plus className="mr-2 h-4 w-4" />
          Nova Tarefa
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-2">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckSquare className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-2xl font-bold text-foreground">{taskStats.total}</p>
                <p className="text-sm text-muted-foreground">Total</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-2">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-2xl font-bold text-foreground">{taskStats.pending}</p>
                <p className="text-sm text-muted-foreground">Pendentes</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-2">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-blue-500" />
              <div>
                <p className="text-2xl font-bold text-foreground">{taskStats.inProgress}</p>
                <p className="text-sm text-muted-foreground">Em Progresso</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-2">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-green-500" />
              <div>
                <p className="text-2xl font-bold text-foreground">{taskStats.completed}</p>
                <p className="text-sm text-muted-foreground">Concluídas</p>
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
                  placeholder="Buscar tarefas..."
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
                <SelectItem value="pending">Pendente</SelectItem>
                <SelectItem value="in_progress">Em Progresso</SelectItem>
                <SelectItem value="completed">Concluída</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas Categorias</SelectItem>
                <SelectItem value="Integration">Integração</SelectItem>
                <SelectItem value="Content">Conteúdo</SelectItem>
                <SelectItem value="Analytics">Analytics</SelectItem>
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
            <p className="text-muted-foreground">Carregando tarefas...</p>
          </CardContent>
        </Card>
      )}

      {/* Error State */}
      {error && (
        <Card className="border-2">
          <CardContent className="p-12 text-center">
            <CheckSquare className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Erro ao carregar tarefas</h3>
            <p className="text-muted-foreground mb-4">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Tasks List */}
      {!loading && !error && (
        <div className="space-y-4">
          {filteredTasks.map((task) => (
          <Card key={task.id} className="border-2 hover:shadow-card transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-foreground text-lg">{task.title}</h3>
                    <Badge variant="outline" className="text-xs">
                      {task.id}
                    </Badge>
                    <Badge className={`text-xs ${getStatusColor(task.status)}`}>
                      {getStatusLabel(task.status)}
                    </Badge>
                    <Badge variant="outline" className={`text-xs border ${getPriorityColor(task.priority)}`}>
                      {task.priority.toUpperCase()}
                    </Badge>
                  </div>
                  {task.description && (
                    <p className="text-muted-foreground mb-4">{task.description}</p>
                  )}
                  
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      <span>Responsável: {task.assignee?.name || 'Não atribuído'}</span>
                    </div>
                    {task.due_date && (
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(task.due_date).toLocaleDateString('pt-BR')}</span>
                      </div>
                    )}
                    <div>
                      <span className="font-medium">Equipe:</span> {task.team}
                    </div>
                    <div>
                      <span className="font-medium">Categoria:</span> {task.category}
                    </div>
                  </div>
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                   <DropdownMenuContent align="end">
                     <DropdownMenuItem onClick={() => handleViewTask(task)}>
                       <CheckSquare className="mr-2 h-4 w-4" />
                       Ver Detalhes
                     </DropdownMenuItem>
                     <DropdownMenuItem onClick={() => handleEditTask(task)}>
                       <Edit className="mr-2 h-4 w-4" />
                       Editar
                     </DropdownMenuItem>
                     {task.status !== 'completed' && (
                       <DropdownMenuItem onClick={() => handleCompleteTask(task.id)}>
                         <CheckCircle className="mr-2 h-4 w-4" />
                         Marcar como Concluída
                       </DropdownMenuItem>
                     )}
                   </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardContent>
          </Card>
          ))}
        </div>
      )}

      {!loading && !error && filteredTasks.length === 0 && (
        <Card className="border-2">
          <CardContent className="p-12 text-center">
            <CheckSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Nenhuma tarefa encontrada</h3>
            <p className="text-muted-foreground">
              {searchTerm || filterStatus !== 'all' || filterCategory !== 'all'
                ? 'Nenhuma tarefa encontrada com os filtros aplicados.'
                : 'Nenhuma tarefa registada ainda.'}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Diálogos */}
      <TaskFormDialog
        task={selectedTask}
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSave={handleSaveTask}
      />

      <TaskDetailsDialog
        task={selectedTask}
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
        onEdit={handleEditTask}
        onDelete={() => {}} // Pode implementar depois se necessário
      />
    </div>
  );
};