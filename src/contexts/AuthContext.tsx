
import React, { createContext, useState, useEffect, useContext } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signUp: (email: string, password: string) => Promise<{ success: boolean; error?: any }>;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: any }>;
  signOut: () => Promise<void>;
  hasRole: (role: string) => boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const signUp = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          emailRedirectTo: `${window.location.origin}/`
        }
      });
      if (error) throw error;
      console.log('Signup successful:', data);
      return { success: true };
    } catch (error: any) {
      console.error('Signup error:', error.message);
      return { success: false, error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });
      if (error) throw error;
      console.log('Signin successful:', data);
      return { success: true };
    } catch (error: any) {
      console.error('Signin error:', error.message);
      return { success: false, error };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      console.log('Signout successful');
    } catch (error: any) {
      console.error('Signout error:', error.message);
    }
  };

  const hasRole = (role: string): boolean => {
    if (!user) return false;
    // Check if the user's email is in the admin list
    const adminEmails = ['admin@iwc.com', 'samuel.watho@gmail.com'];
    if (adminEmails.includes(user.email || '')) {
      return true;
    }
    // For now, return false - will be implemented when user_roles table is used
    return false;
  };

  const isAdmin = (): boolean => {
    if (!user) return false;
    // Check if the user's email is in the admin list
    const adminEmails = ['admin@iwc.com', 'samuel.watho@gmail.com'];
    if (adminEmails.includes(user.email || '')) {
      return true;
    }
    return hasRole('admin');
  };

  useEffect(() => {
    let mounted = true;
    let timeoutId: NodeJS.Timeout;

    const initializeAuth = async () => {
      try {
        console.log('Initializing auth...');
        
        // Set up the auth state listener first
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            console.log('Auth state changed:', event, session?.user?.email);
            
            if (!mounted) return;

            // Update state immediately - don't wait for async operations
            if (session?.user) {
              setUser(session.user);
              setSession(session);
              
              // Defer last login update to avoid blocking the auth flow
              if (event === 'SIGNED_IN') {
                setTimeout(async () => {
                  try {
                    const { updateLastLogin } = await import('@/services/profileAPI');
                    await updateLastLogin();
                  } catch (error) {
                    console.error('Failed to update last login:', error);
                    // Don't let this error break the auth flow
                  }
                }, 100);
              }
            } else {
              setUser(null);
              setSession(null);
            }
            
            // Always set loading to false after auth state is processed
            setIsLoading(false);
          }
        );

        // Set a timeout to ensure loading state is cleared even if auth fails
        timeoutId = setTimeout(() => {
          if (mounted) {
            console.log('Auth timeout - clearing loading state');
            setIsLoading(false);
          }
        }, 5000);

        // Then check for existing session
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error getting session:', error);
        }
        
        if (mounted) {
          if (session?.user) {
            setUser(session.user);
            setSession(session);
          }
          // Clear the timeout since we got a response
          clearTimeout(timeoutId);
          setIsLoading(false);
        }

        return () => {
          mounted = false;
          subscription.unsubscribe();
          clearTimeout(timeoutId);
        };
      } catch (error) {
        console.error('Auth initialization error:', error);
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    const cleanup = initializeAuth();

    return () => {
      mounted = false;
      clearTimeout(timeoutId);
      cleanup?.then(cleanupFn => cleanupFn?.());
    };
  }, []);

  const value: AuthContextType = {
    user,
    session,
    isLoading,
    signUp,
    signIn,
    signOut,
    hasRole,
    isAdmin: isAdmin()
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
