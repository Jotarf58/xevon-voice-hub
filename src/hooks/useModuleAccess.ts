
import { useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserModules } from '@/hooks/useModules';

export const useModuleAccess = () => {
  const { user } = useAuth();
  const { modules, loading } = useUserModules();

  const hasModuleAccess = useMemo(() => {
    return (moduleName: string) => {
      // XEVON users have access to all modules
      if (user?.role === 'XEVON') {
        return true;
      }

      // Paid users need to check their module associations
      if (user?.isPaidUser) {
        return modules.some(module => module.name?.toLowerCase() === moduleName.toLowerCase());
      }

      // Non-paid users only have access to dashboard
      return moduleName.toLowerCase() === 'dashboard';
    };
  }, [user, modules]);

  return {
    hasModuleAccess,
    loading,
    isXevonUser: user?.role === 'XEVON',
    isPaidUser: user?.isPaidUser || false
  };
};
