import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User as SupabaseUser, Session } from '@supabase/supabase-js';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'developer' | 'manager' | 'user';
  team: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Function to fetch user profile
  const fetchUserProfile = async (userId: string) => {
    try {
      // Since the database uses bigint for id_user but auth uses UUID,
      // we'll need to either find a user by email or create a mapping
      // For now, let's try to find by email from the session
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.email) return null;
      
      const { data: profile, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', session.user.email)
        .maybeSingle();
        
      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }
      
      if (profile) {
        return {
          id: profile.id_user.toString(),
          name: profile.name || 'User',
          email: profile.email || '',
          role: 'user' as const,
          team: 'default'
        };
      } else {
        // Create a default user if profile not found in database
        return {
          id: userId,
          name: session.user.email?.split('@')[0] || 'User',
          email: session.user.email || '',
          role: 'user' as const,
          team: 'default'
        };
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      // Return a default user even if there's an error
      const { data: { session } } = await supabase.auth.getSession();
      return {
        id: userId,
        name: session?.user?.email?.split('@')[0] || 'User',
        email: session?.user?.email || '',
        role: 'user' as const,
        team: 'default'
      };
    }
  };

  useEffect(() => {
    let mounted = true;

    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (!mounted) return;
        
        if (error) {
          console.error('Error getting session:', error);
          setSession(null);
          setUser(null);
          setIsLoading(false);
          return;
        }

        setSession(session);
        
        if (session?.user) {
          const userProfile = await fetchUserProfile(session.user.id);
          if (mounted) {
            setUser(userProfile);
          }
        } else {
          setUser(null);
        }
        
        if (mounted) {
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error in getInitialSession:', error);
        if (mounted) {
          setSession(null);
          setUser(null);
          setIsLoading(false);
        }
      }
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!mounted) return;
        
        setSession(session);
        
        if (session?.user) {
          // Use setTimeout to avoid potential deadlocks
          setTimeout(async () => {
            if (mounted) {
              const userProfile = await fetchUserProfile(session.user.id);
              if (mounted) {
                setUser(userProfile);
                setIsLoading(false);
              }
            }
          }, 0);
        } else {
          setUser(null);
          setIsLoading(false);
        }
      }
    );

    // Initialize
    getInitialSession();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setIsLoading(false);
        console.error('Login error:', error);
        return { success: false, error: error.message };
      }

      if (data.session) {
        const userProfile = await fetchUserProfile(data.session.user.id);
        setSession(data.session);
        setUser(userProfile);
      }
      
      setIsLoading(false);
      return { success: true };
    } catch (error: any) {
      setIsLoading(false);
      console.error('Login network error:', error);
      return { 
        success: false, 
        error: error.message || error.toString() || 'Erro de conectividade. Verifique sua conexão.' 
      };
    }
  };

  const signup = async (email: string, password: string, name: string) => {
    try {
      setIsLoading(true);
      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            name: name
          }
        }
      });

      setIsLoading(false);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      setIsLoading(false);
      return { success: false, error: 'Erro inesperado ao criar conta' };
    }
  };

  const logout = async () => {
    setIsLoading(true);
    await supabase.auth.signOut();
    setSession(null);
    setUser(null);
    setIsLoading(false);
  };

  return (
    <AuthContext.Provider value={{ user, session, login, signup, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};