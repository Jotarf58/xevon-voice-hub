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
        
        // XEVON role bypass - show all modules
        if (user.role === 'XEVON') {
          const { data: allModules, error: modulesError } = await supabase
            .from('modules')
            .select('*');

          if (modulesError) {
            console.error('Error fetching all modules:', modulesError);
            setError('Erro ao buscar módulos');
            setLoading(false);
            return;
          }

          setModules(allModules || []);
          setError(null);
          setLoading(false);
          return;
        }

        // Normal flow for regular users
        // First, get the organization by email
        const { data: organization, error: organizationError } = await supabase
          .from('organization')
          .select('id_organization')
          .eq('email', user.email)
          .maybeSingle();

        if (organizationError) {
          console.error('Error fetching organization:', organizationError);
          setError('Erro ao buscar organização');
          setLoading(false);
          return;
        }

        if (!organization) {
          setModules([]);
          setLoading(false);
          return;
        }

        // Get user modules through the junction table
        const { data: userModuleRelations, error: relationsError } = await supabase
          .from('tmodules_torganization')
          .select('id_module')
          .eq('id_organization', organization.id_organization);

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