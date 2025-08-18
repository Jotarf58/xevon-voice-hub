import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { Database } from '@/types/database';

export type Module = Database['public']['Tables']['modules']['Row'];

export const useUserModules = () => {
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchUserModules = async () => {
      if (!user?.email) {
        setModules([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // First, get the paid_user by email
        const { data: paidUser, error: paidUserError } = await supabase
          .from('paid_user')
          .select('id_paid_user')
          .eq('email', user.email)
          .maybeSingle();

        if (paidUserError) {
          console.error('Error fetching paid user:', paidUserError);
          setError('Erro ao buscar usuário');
          setLoading(false);
          return;
        }

        if (!paidUser) {
          setModules([]);
          setLoading(false);
          return;
        }

        // Get user modules through the junction table
        const { data: userModuleRelations, error: relationsError } = await supabase
          .from('tmodules_tpaid_user')
          .select('id_module')
          .eq('id_paid_user', paidUser.id_paid_user);

        if (relationsError) {
          console.error('Error fetching user module relations:', relationsError);
          setError('Erro ao buscar relações de módulos');
          setLoading(false);
          return;
        }

        if (!userModuleRelations || userModuleRelations.length === 0) {
          setModules([]);
          setLoading(false);
          return;
        }

        // Get the actual modules
        const moduleIds = userModuleRelations.map(rel => rel.id_module);
        const { data: userModules, error: modulesError } = await supabase
          .from('modules')
          .select('*')
          .in('id_module', moduleIds);

        if (modulesError) {
          console.error('Error fetching modules:', modulesError);
          setError('Erro ao buscar módulos');
          setLoading(false);
          return;
        }

        setModules(userModules || []);
        setError(null);
      } catch (err) {
        console.error('Unexpected error fetching user modules:', err);
        setError('Erro inesperado');
      } finally {
        setLoading(false);
      }
    };

    fetchUserModules();
  }, [user?.email]);

  return { modules, loading, error };
};