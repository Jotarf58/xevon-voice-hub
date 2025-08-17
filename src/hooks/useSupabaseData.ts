import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export function useCalls() {
  const [calls, setCalls] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchCalls = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('call_history')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setCalls(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar chamadas');
      } finally {
        setLoading(false);
      }
    };

    fetchCalls();
  }, [user]);

  const refetch = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('call_history')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCalls(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar chamadas');
    } finally {
      setLoading(false);
    }
  };

  return { calls, loading, error, refetch };
}

export function useMessages() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchMessages = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('message_history')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setMessages(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar mensagens');
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [user]);

  const refetch = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('message_history')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMessages(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar mensagens');
    } finally {
      setLoading(false);
    }
  };

  return { messages, loading, error, refetch };
}

export function useTasks() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchTasks = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('tasks')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setTasks(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar tarefas');
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [user]);

  const refetch = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTasks(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar tarefas');
    } finally {
      setLoading(false);
    }
  };

  return { tasks, loading, error, refetch };
}

// Tickets não existem na base de dados AMS-Database, então retorno vazio
export function useTickets() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refetch = async () => {
    // Não há tabela tickets na AMS-Database
  };

  return { tickets, loading, error, refetch };
}

export function useUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchUsers = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching users from users table...');
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      console.log('Users query result:', { data, error });
      if (error) throw error;
      setUsers(data || []);
      console.log('Users loaded:', data?.length || 0);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(err instanceof Error ? err.message : 'Erro ao carregar utilizadores');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [user]);

  const refetch = () => {
    return fetchUsers();
  };

  return { users, loading, error, refetch };
}

// Hook simplificado para operações com tarefas
export function useTaskOperations() {
  const { user } = useAuth();

  const createTask = async (taskData: any) => {
    if (!user) throw new Error('Utilizador não autenticado');

    const { data, error } = await supabase
      .from('tasks')
      .insert({
        title: taskData.title,
        description: taskData.description,
        category: taskData.category,
        phone_number: taskData.phone_number || null,
        status: true
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  };

  const updateTask = async (taskId: string, taskData: any) => {
    if (!user) throw new Error('Utilizador não autenticado');

    const { data, error } = await supabase
      .from('tasks')
      .update({
        title: taskData.title,
        description: taskData.description,
        category: taskData.category,
        phone_number: taskData.phone_number || null,
        status: taskData.status
      })
      .eq('id_task', parseInt(taskId))
      .select()
      .single();

    if (error) throw error;
    return data;
  };

  const deleteTask = async (taskId: string) => {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id_task', parseInt(taskId));
    
    if (error) throw error;
  };

  const completeTask = async (taskId: string) => {
    const { error } = await supabase
      .from('tasks')
      .update({ status: true })
      .eq('id_task', parseInt(taskId));
    
    if (error) throw error;
  };

  const archiveTask = async (taskId: string) => {
    // Não há campo archived na AMS-Database, vamos deletar a tarefa
    await deleteTask(taskId);
  };

  return { createTask, updateTask, deleteTask, completeTask, archiveTask };
}

// Hook para operações de chamadas
export function useCallOperations() {
  const { user } = useAuth();

  const createCall = async (callData: any) => {
    if (!user) throw new Error('Utilizador não autenticado');

    const { data, error } = await supabase
      .from('call_history')
      .insert({
        phone_number: callData.phone_number,
        total_call_time: callData.total_call_time || null,
        status: callData.status || false,
        transcription: callData.transcription || null
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  };

  const updateCall = async (callId: string, callData: any) => {
    if (!user) throw new Error('Utilizador não autenticado');

    const { data, error } = await supabase
      .from('call_history')
      .update({
        phone_number: callData.phone_number,
        total_call_time: callData.total_call_time,
        status: callData.status,
        transcription: callData.transcription
      })
      .eq('id_call', parseInt(callId))
      .select()
      .single();

    if (error) throw error;
    return data;
  };

  return { createCall, updateCall };
}

// Hook para operações de mensagens
export function useMessageOperations() {
  const { user } = useAuth();

  const createMessage = async (messageData: any) => {
    if (!user) throw new Error('Utilizador não autenticado');

    const { data, error } = await supabase
      .from('message_history')
      .insert({
        phone_number: messageData.phone_number,
        content: messageData.content
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  };

  const updateMessage = async (messageId: string, messageData: any) => {
    if (!user) throw new Error('Utilizador não autenticado');

    const { data, error } = await supabase
      .from('message_history')
      .update({
        phone_number: messageData.phone_number,
        content: messageData.content
      })
      .eq('id_message', parseInt(messageId))
      .select()
      .single();

    if (error) throw error;
    return data;
  };

  return { createMessage, updateMessage };
}

// Hook para operações de utilizadores
export function useUserOperations() {
  const { user } = useAuth();

  const updateUserProfile = async (userId: string, userData: any) => {
    if (!user) throw new Error('Utilizador não autenticado');

    const { data, error } = await supabase
      .from('users')
      .update({
        name: userData.name,
        email: userData.email,
        phone_number: userData.phone_number || null
      })
      .eq('id_user', parseInt(userId))
      .select()
      .single();

    if (error) throw error;
    return data;
  };

  return { updateUserProfile };
}

// Hooks simplificados para compatibilidade
export function useInitializeDemoData() {
  // Não aplicável para AMS-Database
}

export function useTicketOperations() {
  return {
    createTicket: () => Promise.reject('Tickets não disponíveis'),
    updateTicket: () => Promise.reject('Tickets não disponíveis'),
    closeTicket: () => Promise.reject('Tickets não disponíveis')
  };
}

export function useRecentTickets() {
  return { recentTickets: [], loading: false };
}

export function useHighPriorityTasks() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchHighPriorityTasks = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('tasks')
          .select('*')
          .eq('status', false) // tarefas não concluídas
          .order('created_at', { ascending: false })
          .limit(5);

        if (error) throw error;
        setTasks(data || []);
      } catch (err) {
        console.error('Erro ao carregar tarefas prioritárias:', err);
        setTasks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHighPriorityTasks();
  }, [user]);

  return { tasks, loading };
}

export function useDashboardStats() {
  const [stats, setStats] = useState({
    totalTasks: 0,
    activeTasks: 0,
    totalTickets: 0,
    openTickets: 0,
    totalCalls: 0,
    todayCalls: 0,
    totalMessages: 0,
    todayMessages: 0
  });
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        
        const today = new Date().toISOString().split('T')[0];
        
        const [tasksResult, callsResult, messagesResult] = await Promise.all([
          supabase.from('tasks').select('status', { count: 'exact' }),
          supabase.from('call_history').select('created_at', { count: 'exact' }),
          supabase.from('message_history').select('created_at', { count: 'exact' })
        ]);

        const activeTasks = tasksResult.data?.filter(task => !task.status).length || 0;
        
        const todayCalls = callsResult.data?.filter(call => 
          call.created_at.startsWith(today)
        ).length || 0;

        const todayMessages = messagesResult.data?.filter(message => 
          message.created_at.startsWith(today)
        ).length || 0;

        setStats({
          totalTasks: tasksResult.count || 0,
          activeTasks,
          totalTickets: 0, // Não há tickets
          openTickets: 0,
          totalCalls: callsResult.count || 0,
          todayCalls,
          totalMessages: messagesResult.count || 0,
          todayMessages
        });
      } catch (err) {
        console.error('Erro ao carregar estatísticas:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user]);

  return { stats, loading };
}

export function useArchivedTasks() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const refetch = async () => {
    // Não há campo archived na tabela tasks
  };

  return { tasks, loading, error, refetch };
}