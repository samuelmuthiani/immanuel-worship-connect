
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface UserRole {
  role: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  userRoles: string[];
  isLoading: boolean;
  isAdmin: boolean;
  hasRole: (role: string) => boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
  requestPasswordReset: (email: string) => Promise<{ success: boolean; error?: string }>;
  updatePassword: (password: string) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userRoles, setUserRoles] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const adminEmails = ['admin@iwc.com', 'samuel.watho@gmail.com'];

  const fetchUserRoles = async (userId: string) => {
    try {
      const { data: roles, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId);

      if (error) {
        console.error('Error fetching user roles:', error);
        return [];
      }

      return roles?.map((r: UserRole) => r.role) || [];
    } catch (error) {
      console.error('Error in fetchUserRoles:', error);
      return [];
    }
  };

  useEffect(() => {
    let mounted = true;

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        if (!mounted) return;

        console.log('Auth state change:', event, !!currentSession);

        // Handle session expiry and invalid sessions
        if (event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED') {
          if (!currentSession) {
            setSession(null);
            setUser(null);
            setUserRoles([]);
            setIsLoading(false);
            return;
          }
        }

        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        if (currentSession?.user) {
          // Fetch roles with retry logic
          setTimeout(async () => {
            if (mounted) {
              try {
                const roles = await fetchUserRoles(currentSession.user.id);
                setUserRoles(roles);
              } catch (error) {
                console.error('Failed to fetch user roles:', error);
                setUserRoles([]);
              }
            }
          }, 100);
        } else {
          setUserRoles([]);
        }
        
        setIsLoading(false);
      }
    );

    // Initial session check
    supabase.auth.getSession().then(({ data: { session: currentSession }, error }) => {
      if (!mounted) return;
      
      if (error) {
        console.error('Error getting session:', error);
        setIsLoading(false);
        return;
      }
      
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      if (currentSession?.user) {
        fetchUserRoles(currentSession.user.id).then(roles => {
          if (mounted) setUserRoles(roles);
        });
      }
      
      setIsLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      // Sanitize email input
      const sanitizedEmail = email.trim().toLowerCase();
      
      if (!sanitizedEmail || !password) {
        return { success: false, error: 'Email and password are required' };
      }

      const { data, error } = await supabase.auth.signInWithPassword({ 
        email: sanitizedEmail, 
        password 
      });
      
      if (error) {
        // Don't expose internal error details
        let userMessage = 'Invalid email or password';
        if (error.message.includes('Email not confirmed')) {
          userMessage = 'Please check your email and confirm your account before signing in';
        }
        
        toast({
          title: 'Sign in failed',
          description: userMessage,
          variant: 'destructive',
        });
        return { success: false, error: userMessage };
      }
      
      if (data.user) {
        toast({
          title: 'Welcome back!',
          description: `Successfully signed in as ${data.user.email}`,
        });
        return { success: true };
      }
      
      return { success: false, error: 'Authentication failed' };
    } catch (error: any) {
      console.error('Login error:', error);
      const errorMessage = 'An unexpected error occurred. Please try again.';
      toast({
        title: 'Sign in failed',
        description: errorMessage,
        variant: 'destructive',
      });
      return { success: false, error: errorMessage };
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      // Sanitize and validate inputs
      const sanitizedEmail = email.trim().toLowerCase();
      
      if (!sanitizedEmail || !password) {
        return { success: false, error: 'Email and password are required' };
      }

      // Password strength validation
      if (password.length < 8) {
        return { success: false, error: 'Password must be at least 8 characters long' };
      }

      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({ 
        email: sanitizedEmail, 
        password,
        options: {
          emailRedirectTo: redirectUrl
        }
      });
      
      if (error) {
        let userMessage = error.message;
        if (error.message.includes('already registered')) {
          userMessage = 'An account with this email already exists. Please sign in instead.';
        }
        
        toast({
          title: 'Sign up failed',
          description: userMessage,
          variant: 'destructive',
        });
        return { success: false, error: userMessage };
      }
      
      toast({
        title: 'Account created!',
        description: 'Please check your email for confirmation instructions.',
      });
      
      return { success: true };
    } catch (error: any) {
      console.error('Signup error:', error);
      const errorMessage = 'An unexpected error occurred. Please try again.';
      toast({
        title: 'Sign up failed',
        description: errorMessage,
        variant: 'destructive',
      });
      return { success: false, error: errorMessage };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // Clear local state
      setSession(null);
      setUser(null);
      setUserRoles([]);
      
      toast({
        title: 'Signed out',
        description: 'You have been successfully signed out.',
      });
    } catch (error) {
      console.error('Sign out error:', error);
      toast({
        title: 'Sign out failed',
        description: 'There was an error signing out.',
        variant: 'destructive',
      });
    }
  };

  const refreshSession = async () => {
    try {
      const { data, error } = await supabase.auth.refreshSession();
      if (error) throw error;
      
      if (data.session) {
        setSession(data.session);
        setUser(data.session.user);
        const roles = await fetchUserRoles(data.session.user.id);
        setUserRoles(roles);
      }
    } catch (error) {
      console.error('Session refresh error:', error);
      // Force sign out on refresh failure
      await signOut();
    }
  };

  const requestPasswordReset = async (email: string) => {
    try {
      const sanitizedEmail = email.trim().toLowerCase();
      
      if (!sanitizedEmail) {
        return { success: false, error: 'Email is required' };
      }

      const { error } = await supabase.auth.resetPasswordForEmail(sanitizedEmail, {
        redirectTo: `${window.location.origin}/update-password`,
      });
      
      if (error) {
        // Don't reveal whether email exists or not
        console.error('Password reset error:', error);
      }
      
      // Always return success to prevent email enumeration
      return { success: true };
    } catch (error) {
      console.error('Password reset error:', error);
      return { success: true }; // Still return success
    }
  };

  const updatePassword = async (password: string) => {
    try {
      if (password.length < 8) {
        return { success: false, error: 'Password must be at least 8 characters long' };
      }

      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      
      // Refresh session after password change
      await refreshSession();
      
      return { success: true };
    } catch (error: any) {
      console.error('Password update error:', error);
      return { success: false, error: error.message || 'Failed to update password' };
    }
  };

  const hasRole = (role: string) => {
    if (!user) return false;
    
    // Check hardcoded admin emails
    if (adminEmails.includes(user.email || '') && role === 'admin') {
      return true;
    }
    
    return userRoles.includes(role) || userRoles.includes('admin');
  };

  const isAdmin = hasRole('admin');

  const value = {
    user,
    session,
    userRoles,
    isLoading,
    isAdmin,
    hasRole,
    signIn,
    signUp,
    signOut,
    refreshSession,
    requestPasswordReset,
    updatePassword,
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
