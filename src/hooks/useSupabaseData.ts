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
          .from('calls')
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
        .from('calls')
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
          .from('messages')
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
        .from('messages')
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
          .select(`
            *,
            assignee:profiles!tasks_assignee_id_fkey(name, email),
            creator:profiles!tasks_created_by_fkey(name, email)
          `)
          .eq('archived', false)
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
        .select(`
          *,
          assignee:profiles!tasks_assignee_id_fkey(name, email),
          creator:profiles!tasks_created_by_fkey(name, email)
        `)
        .eq('archived', false)
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

export function useTickets() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchTickets = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('tickets')
          .select(`
            *,
            assignee:profiles!tickets_assignee_id_fkey(name, email),
            reporter:profiles!tickets_reporter_id_fkey(name, email)
          `)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setTickets(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar tickets');
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [user]);

  const refetch = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('tickets')
        .select(`
          *,
          assignee:profiles!tickets_assignee_id_fkey(name, email),
          reporter:profiles!tickets_reporter_id_fkey(name, email)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTickets(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar tickets');
    } finally {
      setLoading(false);
    }
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
      console.log('Fetching users from profiles table...');
      const { data, error } = await supabase
        .from('profiles')
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

// Hook para inserir dados de demonstração para novos utilizadores
export function useInitializeDemoData() {
  const { user } = useAuth();

  useEffect(() => {
    const initializeDemoData = async () => {
      if (!user?.id) return;
      
      try {
        const { error } = await supabase.rpc('insert_demo_data_for_user', {
          new_user_id: user.id
        });
        
        if (error) {
          console.error('Erro ao inicializar dados de demonstração:', error);
        }
      } catch (err) {
        console.error('Erro ao chamar função de dados de demonstração:', err);
      }
    };

    initializeDemoData();
  }, [user?.id]);
}

// Hook para criar/atualizar tarefas
export function useTaskOperations() {
  const { user } = useAuth();

  const createTask = async (taskData: any) => {
    if (!user) throw new Error('Utilizador não autenticado');

    const { data, error } = await supabase
      .from('tasks')
      .insert({
        title: taskData.title,
        description: taskData.description,
        status: taskData.status,
        priority: taskData.priority,
        category: taskData.category,
        team: taskData.team,
        assignee_id: user.id,
        due_date: taskData.due_date,
        created_by: user.id
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
        status: taskData.status,
        priority: taskData.priority,
        category: taskData.category,
        team: taskData.team,
        due_date: taskData.due_date,
        updated_at: new Date().toISOString()
      })
      .eq('id', taskId)
      .select()
      .single();

    if (error) throw error;
    return data;
  };

  const completeTask = async (taskId: string) => {
    const { error } = await supabase
      .from('tasks')
      .update({ status: 'completed' })
      .eq('id', taskId);
    
    if (error) throw error;
  };

  const archiveTask = async (taskId: string) => {
    const { error } = await supabase
      .from('tasks')
      .update({ archived: true })
      .eq('id', taskId);
    
    if (error) throw error;
  };

  const deleteTask = async (taskId: string) => {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', taskId);
    
    if (error) throw error;
  };

  return { createTask, updateTask, deleteTask, completeTask, archiveTask };
}

// Hook para criar/atualizar tickets
export function useTicketOperations() {
  const { user } = useAuth();

  const createTicket = async (ticketData: any) => {
    if (!user) throw new Error('Utilizador não autenticado');

    const { data, error } = await supabase
      .from('tickets')
      .insert({
        title: ticketData.title,
        description: ticketData.description,
        status: ticketData.status,
        priority: ticketData.priority,
        type: ticketData.type,
        team: ticketData.team,
        reporter_id: user.id
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  };

  const updateTicket = async (ticketId: string, ticketData: any) => {
    if (!user) throw new Error('Utilizador não autenticado');

    const { data, error } = await supabase
      .from('tickets')
      .update({
        title: ticketData.title,
        description: ticketData.description,
        status: ticketData.status,
        priority: ticketData.priority,
        type: ticketData.type,
        team: ticketData.team,
        updated_at: new Date().toISOString()
      })
      .eq('id', ticketId)
      .select()
      .single();

    if (error) throw error;
    return data;
  };

  const closeTicket = async (ticketId: string, resolution: string) => {
    if (!user) throw new Error('Utilizador não autenticado');

    const { data, error } = await supabase
      .from('tickets')
      .update({ 
        status: 'closed',
        resolution: resolution,
        resolved_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', ticketId)
      .select()
      .single();

    if (error) throw error;
    return data;
  };

  return { createTicket, updateTicket, closeTicket };
}

// Hook para tickets recentes
export function useRecentTickets() {
  const [recentTickets, setRecentTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchRecentTickets = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('tickets')
          .select(`
            *,
            assignee:profiles!tickets_assignee_id_fkey(name, email),
            reporter:profiles!tickets_reporter_id_fkey(name, email)
          `)
          .order('created_at', { ascending: false })
          .limit(3);

        if (error) throw error;
        setRecentTickets(data || []);
      } catch (err) {
        console.error('Erro ao carregar tickets recentes:', err);
        setRecentTickets([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentTickets();
  }, [user]);

  return { recentTickets, loading };
}

// Hook otimizado para tarefas prioritárias ordenadas por prioridade e data
export function useHighPriorityTasks() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchHighPriorityTasks = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        // Query otimizada: busca todas as prioridades e ordena corretamente
        const { data, error } = await supabase
          .from('tasks')
          .select(`
            id,
            title,
            description,
            status,
            priority,
            category,
            team,
            due_date,
            created_at,
            assignee:profiles!tasks_assignee_id_fkey(name, email),
            creator:profiles!tasks_created_by_fkey(name, email)
          `)
          .eq('archived', false)
          .in('status', ['pending', 'in_progress'])
          .limit(10);

        if (error) throw error;
        
        // Ordenar por prioridade (high -> medium -> low) e depois por data (mais antigas primeiro)
        const sortedTasks = (data || []).sort((a, b) => {
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
          
          if (priorityDiff !== 0) return priorityDiff;
          
          // Mesma prioridade: mais antigas primeiro
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        }).slice(0, 5);

        setTasks(sortedTasks);
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
        
        // Get today's date
        const today = new Date().toISOString().split('T')[0];
        
        // Fetch all stats in parallel
        const [tasksResult, ticketsResult, callsResult, messagesResult] = await Promise.all([
          supabase.from('tasks').select('status', { count: 'exact' }),
          supabase.from('tickets').select('status', { count: 'exact' }),
          supabase.from('calls').select('created_at', { count: 'exact' }),
          supabase.from('messages').select('created_at', { count: 'exact' })
        ]);

        // Count active tasks
        const activeTasks = tasksResult.data?.filter(task => 
          task.status === 'pending' || task.status === 'in_progress'
        ).length || 0;

        // Count open tickets
        const openTickets = ticketsResult.data?.filter(ticket => 
          ticket.status === 'open' || ticket.status === 'in_progress'
        ).length || 0;

        // Count today's calls
        const todayCalls = callsResult.data?.filter(call => 
          call.created_at.startsWith(today)
        ).length || 0;

        // Count today's messages
        const todayMessages = messagesResult.data?.filter(message => 
          message.created_at.startsWith(today)
        ).length || 0;

        setStats({
          totalTasks: tasksResult.count || 0,
          activeTasks,
          totalTickets: ticketsResult.count || 0,
          openTickets,
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
  const { user } = useAuth();

  useEffect(() => {
    const fetchArchivedTasks = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('tasks')
          .select(`
            *,
            assignee:profiles!tasks_assignee_id_fkey(name, email),
            creator:profiles!tasks_created_by_fkey(name, email)
          `)
          .eq('archived', true)
          .order('updated_at', { ascending: false });

        if (error) throw error;
        setTasks(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar tarefas arquivadas');
      } finally {
        setLoading(false);
      }
    };

    fetchArchivedTasks();
  }, [user]);

  const refetch = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('tasks')
        .select(`
          *,
          assignee:profiles!tasks_assignee_id_fkey(name, email),
          creator:profiles!tasks_created_by_fkey(name, email)
        `)
        .eq('archived', true)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setTasks(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar tarefas arquivadas');
    } finally {
      setLoading(false);
    }
  };

  return { tasks, loading, error, refetch };
}

// Hook para operações de chamadas
export function useCallOperations() {
  const { user } = useAuth();

  const createCall = async (callData: any) => {
    if (!user) throw new Error('Utilizador não autenticado');

    const { data, error } = await supabase
      .from('calls')
      .insert({
        caller_number: callData.caller_number,
        receiver_number: callData.receiver_number,
        status: callData.status,
        duration: callData.duration,
        notes: callData.notes,
        handled_by: user.id
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  };

  const updateCall = async (callId: string, callData: any) => {
    if (!user) throw new Error('Utilizador não autenticado');

    const { data, error } = await supabase
      .from('calls')
      .update({
        caller_number: callData.caller_number,
        receiver_number: callData.receiver_number,
        status: callData.status,
        duration: callData.duration,
        notes: callData.notes,
        ended_at: callData.status === 'completed' ? new Date().toISOString() : null
      })
      .eq('id', callId)
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
      .from('messages')
      .insert({
        sender_number: messageData.sender_number,
        receiver_number: messageData.receiver_number,
        content: messageData.content,
        message_type: messageData.message_type,
        status: messageData.status,
        media_url: messageData.media_url || null,
        processed_by: user.id
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  };

  const updateMessage = async (messageId: string, messageData: any) => {
    if (!user) throw new Error('Utilizador não autenticado');

    const { data, error } = await supabase
      .from('messages')
      .update({
        sender_number: messageData.sender_number,
        receiver_number: messageData.receiver_number,
        content: messageData.content,
        message_type: messageData.message_type,
        status: messageData.status,
        media_url: messageData.media_url || null,
        delivered_at: messageData.status === 'delivered' || messageData.status === 'read' ? new Date().toISOString() : null,
        read_at: messageData.status === 'read' ? new Date().toISOString() : null
      })
      .eq('id', messageId)
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
      .from('profiles')
      .update({
        name: userData.name,
        email: userData.email,
        role: userData.role,
        team: userData.team,
        avatar_url: userData.avatar_url || null,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  };

  return { updateUserProfile };
}