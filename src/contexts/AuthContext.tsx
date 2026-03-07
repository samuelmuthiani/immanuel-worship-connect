
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { SecurityService } from '@/utils/security';
import { logger } from '@/lib/logger';

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
  signUp: (email: string, password: string, metadata?: Record<string, any>) => Promise<{ success: boolean; user?: User; error?: string }>;
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

  const fetchUserRoles = async (userId: string) => {
    try {
      const { data: roles, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId);

      if (error) {
        logger.error('Error fetching user roles:', error);
        return [];
      }

      return roles?.map((r: UserRole) => r.role) || [];
    } catch (error) {
      logger.error('Error in fetchUserRoles:', error);
      return [];
    }
  };

  useEffect(() => {
    let mounted = true;

    // Safety timeout to ensure loading state is cleared within 5 seconds
    const safetyTimeout = setTimeout(() => {
      if (mounted && isLoading) {
        logger.warn('Auth check safety timeout reached. Forcing loading state to false.');
        setIsLoading(false);
      }
    }, 5000);

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        if (!mounted) return;

        logger.info('Auth state change:', event, !!currentSession);

        if (event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED' || event === 'SIGNED_IN') {
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
          try {
            const roles = await fetchUserRoles(currentSession.user.id);
            if (mounted) {
              setUserRoles(roles);
              setIsLoading(false);
            }
          } catch (error) {
            logger.error('Failed to fetch user roles during auth change:', error);
            if (mounted) {
              setUserRoles([]);
              setIsLoading(false);
            }
          }
        } else if (mounted) {
          setUserRoles([]);
          setIsLoading(false);
        }
      }
    );

    const checkInitialSession = async () => {
      try {
        const { data: { session: currentSession }, error } = await supabase.auth.getSession();
        
        if (!mounted) return;

        if (error) {
          logger.error('Error getting initial session:', error);
          setIsLoading(false);
          return;
        }

        setSession(currentSession);
        setUser(currentSession?.user ?? null);

        if (currentSession?.user) {
          try {
            const roles = await fetchUserRoles(currentSession.user.id);
            if (mounted) setUserRoles(roles);
          } catch (error) {
            logger.error('Failed to fetch user roles during initial session check:', error);
            if (mounted) setUserRoles([]);
          }
        } else if (mounted) {
          setUserRoles([]);
        }
      } catch (err) {
        logger.error('Critical auth error during session check:', err);
      } finally {
        if (mounted) {
          setIsLoading(false);
          clearTimeout(safetyTimeout);
        }
      }
    };

    checkInitialSession();

    return () => {
      mounted = false;
      subscription.unsubscribe();
      clearTimeout(safetyTimeout);
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const sanitizedEmail = SecurityService.sanitizeEmail(email);

      if (!SecurityService.validateEmail(sanitizedEmail)) {
        return { success: false, error: 'Please enter a valid email address' };
      }

      if (!password) {
        return { success: false, error: 'Password is required' };
      }

      const clientIP = 'browser-session';
      if (SecurityService.isRateLimited(`signin-${clientIP}`, 5, 15 * 60 * 1000)) {
        return { success: false, error: 'Too many login attempts. Please wait before trying again.' };
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: sanitizedEmail,
        password
      });

      if (error) {
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
        SecurityService.clearRateLimit(`signin-${clientIP}`);
        toast({
          title: 'Welcome back!',
          description: `Successfully signed in as ${data.user.email}`,
        });
        return { success: true };
      }

      return { success: false, error: 'Authentication failed' };
    } catch (error: unknown) {
      logger.error('Login error:', error);
      const errorMessage = 'An unexpected error occurred. Please try again.';
      toast({
        title: 'Sign in failed',
        description: errorMessage,
        variant: 'destructive',
      });
      return { success: false, error: errorMessage };
    }
  };

  const signUp = async (email: string, password: string, metadata?: Record<string, any>) => {
    try {
      const sanitizedEmail = SecurityService.sanitizeEmail(email);

      if (!SecurityService.validateEmail(sanitizedEmail)) {
        return { success: false, error: 'Please enter a valid email address' };
      }

      const passwordValidation = SecurityService.validatePassword(password);
      if (!passwordValidation.isValid) {
        return { success: false, error: passwordValidation.errors[0] };
      }

      const clientIP = 'browser-session';
      if (SecurityService.isRateLimited(`signup-${clientIP}`, 3, 15 * 60 * 1000)) {
        return { success: false, error: 'Too many signup attempts. Please wait before trying again.' };
      }

      const redirectUrl = `${window.location.origin}/login`;

      const { data, error } = await supabase.auth.signUp({
        email: sanitizedEmail,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: metadata
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

      SecurityService.clearRateLimit(`signup-${clientIP}`);
      toast({
        title: 'Account created!',
        description: 'Please check your email for confirmation instructions.',
      });

      return { success: true, user: data.user ?? undefined };
    } catch (error: unknown) {
      logger.error('Signup error:', error);
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

      setSession(null);
      setUser(null);
      setUserRoles([]);

      toast({
        title: 'Signed out',
        description: 'You have been successfully signed out.',
      });
    } catch (error) {
      logger.error('Sign out error:', error);
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
      logger.error('Session refresh error:', error);
      await signOut();
    }
  };

  const requestPasswordReset = async (email: string) => {
    try {
      const sanitizedEmail = SecurityService.sanitizeEmail(email);

      if (!SecurityService.validateEmail(sanitizedEmail)) {
        return { success: false, error: 'Please enter a valid email address' };
      }

      const { error } = await supabase.auth.resetPasswordForEmail(sanitizedEmail, {
        redirectTo: `${window.location.origin}/update-password`,
      });

      if (error) {
        logger.error('Password reset error:', error);
      }

      return { success: true };
    } catch (error) {
      logger.error('Password reset error:', error);
      return { success: true };
    }
  };

  const updatePassword = async (password: string) => {
    try {
      const passwordValidation = SecurityService.validatePassword(password);
      if (!passwordValidation.isValid) {
        return { success: false, error: passwordValidation.errors[0] };
      }

      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;

      await refreshSession();

      return { success: true };
    } catch (error: unknown) {
      logger.error('Password update error:', error);
      return { success: false, error: (error instanceof Error ? error.message : String(error)) || 'Failed to update password' };
    }
  };

  const hasRole = (role: string) => {
    // If we're still loading, we can't accurately check roles
    if (isLoading) return false;
    if (!user) return false;
    
    // Explicit check for admin role
    const isUserAdmin = userRoles.some(r => r === 'admin');
    if (isUserAdmin) return true;
    
    return userRoles.includes(role);
  };

  const isAdmin = !isLoading && userRoles.some(r => r === 'admin');

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
