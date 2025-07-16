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

  useEffect(() => {
    const fetchUsers = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setUsers(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar utilizadores');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [user]);

  const refetch = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar utilizadores');
    } finally {
      setLoading(false);
    }
  };

  return { users, loading, error, refetch };
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