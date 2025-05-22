
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface UserRole {
  role: string;
}

interface AuthContextType {
  session: Session | null;
  user: User | null;
  userRoles: string[];
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  loading: boolean;
  hasRole: (role: string) => boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [userRoles, setUserRoles] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        // Don't fetch roles here directly to avoid potential deadlock
        if (currentSession?.user) {
          setTimeout(() => {
            fetchUserRoles(currentSession.user.id);
          }, 0);
        } else {
          setUserRoles([]);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      if (currentSession?.user) {
        fetchUserRoles(currentSession.user.id);
      }
      
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserRoles = async (userId: string) => {
    try {
      const { data: roles, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId);

      if (error) {
        console.error('Error fetching user roles:', error);
        return;
      }

      const roleNames = roles?.map((r: UserRole) => r.role) || [];
      setUserRoles(roleNames);
    } catch (error) {
      console.error('Error in fetchUserRoles:', error);
      setUserRoles([]);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        toast({
          title: 'Sign in failed',
          description: error.message,
          variant: 'destructive',
        });
        return { success: false, error: error.message };
      }
      
      if (data.user) {
        toast({
          title: 'Signed in successfully',
          description: `Welcome, ${data.user.email}!`,
        });
        return { success: true };
      }
      
      return { success: false, error: 'Unknown error occurred' };
    } catch (error: any) {
      toast({
        title: 'Sign in failed',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive',
      });
      return { success: false, error: error.message };
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({ email, password });
      
      if (error) {
        toast({
          title: 'Sign up failed',
          description: error.message,
          variant: 'destructive',
        });
        return { success: false, error: error.message };
      }
      
      toast({
        title: 'Sign up successful',
        description: 'Please check your email for confirmation instructions.',
      });
      
      return { success: true };
    } catch (error: any) {
      toast({
        title: 'Sign up failed',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive',
      });
      return { success: false, error: error.message };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    toast({
      title: 'Signed out successfully',
    });
  };

  const hasRole = (role: string) => {
    if (!userRoles.length) return false;
    return userRoles.includes(role) || userRoles.includes('admin');
  };

  const isAdmin = userRoles.includes('admin');

  const value = {
    session,
    user,
    userRoles,
    signIn,
    signUp,
    signOut,
    loading,
    hasRole,
    isAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
