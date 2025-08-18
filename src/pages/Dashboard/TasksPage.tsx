
import React, { useState, useEffect } from 'react';
import { ModuleGuard } from '@/components/ModuleProtection/ModuleGuard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { CheckSquare, Search, Plus, Clock, Circle, CheckCircle } from 'lucide-react';
import { useSupabaseData } from '@/hooks/useSupabaseData';
import { TaskFormDialog } from '@/components/Dialogs/TaskFormDialog';
import { TaskDetailsDialog } from '@/components/Dialogs/TaskDetailsDialog';

const TasksPageContent = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const { data: tasks, loading, error, refetch } = useSupabaseData({
    table: 'tasks',
    select: '*',
    orderBy: { column: 'created_at', ascending: false }
  });

  const filteredTasks = tasks?.filter(task => 
    task.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.category?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const getStatusIcon = (status: boolean) => {
    return status ? (
      <CheckCircle className="h-4 w-4 text-green-500" />
    ) : (
      <Circle className="h-4 w-4 text-yellow-500" />
    );
  };

  const getStatusBadge = (status: boolean) => {
    return (
      <Badge variant={status ? "default" : "secondary"}>
        {status ? "Concluída" : "Pendente"}
      </Badge>
    );
  };

  const handleViewDetails = (task: any) => {
    setSelectedTask(task);
    setIsDetailsOpen(true);
  };

  const truncateText = (text: string, maxLength: number = 80) => {
    if (!text) return 'N/A';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tarefas</h1>
          <p className="text-muted-foreground">
            Gerencie e monitore suas tarefas
          </p>
        </div>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Tarefa
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Pesquisar por título, descrição ou categoria..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-3 bg-muted rounded"></div>
                  <div className="h-3 bg-muted rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : error ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              Erro ao carregar tarefas: {error}
            </p>
          </CardContent>
        </Card>
      ) : filteredTasks.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <CheckSquare className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                {searchTerm ? 'Nenhuma tarefa encontrada.' : 'Nenhuma tarefa criada ainda.'}
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredTasks.map((task) => (
            <Card key={task.id_task} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <CheckSquare className="h-5 w-5" />
                    {truncateText(task.title, 30)}
                  </CardTitle>
                  {getStatusIcon(task.status)}
                </div>
                <CardDescription className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  {task.created_at ? new Date(task.created_at).toLocaleString('pt-BR') : 'N/A'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    {truncateText(task.description)}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Status:</span>
                    {getStatusBadge(task.status)}
                  </div>
                  {task.category && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Categoria:</span>
                      <Badge variant="outline">{task.category}</Badge>
                    </div>
                  )}
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full mt-2"
                    onClick={() => handleViewDetails(task)}
                  >
                    Ver Detalhes
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <TaskFormDialog 
        open={isFormOpen} 
        onOpenChange={setIsFormOpen}
        onSuccess={() => {
          refetch();
          setIsFormOpen(false);
        }}
      />

      <TaskDetailsDialog
        task={selectedTask}
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
      />
    </div>
  );
};

export default function TasksPage() {
  return (
    <ModuleGuard moduleName="tasks">
      <TasksPageContent />
    </ModuleGuard>
  );
}
