import React, { createContext, useState, useEffect, useContext } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { SecurityService } from '@/utils/security';

import { updateLastLogin } from '@/services/profileAPI';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  hasRole: (role: string) => boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Validate session integrity
    if (session?.access_token && !SecurityService.validateSessionToken(session.access_token)) {
      console.warn('Invalid session token detected in AuthContext');
      // Consider logging out the user or refreshing the session
    }
  }, [session]);

  const signUp = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
      });
      if (error) throw error;
      console.log('Signup successful:', data);
    } catch (error: any) {
      console.error('Signup error:', error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });
      if (error) throw error;
      console.log('Signin successful:', data);
    } catch (error: any) {
      console.error('Signin error:', error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      console.log('Signout successful');
    } catch (error: any) {
      console.error('Signout error:', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const hasRole = (role: string): boolean => {
    if (!user) return false;
    // Check if the user's email is in the admin list
    const adminEmails = ['admin@iwc.com', 'samuel.watho@gmail.com'];
    if (adminEmails.includes(user.email || '')) {
      return true;
    }

    // Check if the user has the specified role
    return SecurityService.hasRole(user.id, role);
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

    const initializeAuth = async () => {
      try {
        // Set up the auth state listener first
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            console.log('Auth state changed:', event, session?.user?.email);
            
            if (!mounted) return;

            if (session?.user) {
              setUser(session.user);
              setSession(session);
              
              // Update last login timestamp when user signs in
              if (event === 'SIGNED_IN') {
                setTimeout(() => {
                  updateLastLogin().catch(console.error);
                }, 0);
              }
            } else {
              setUser(null);
              setSession(null);
            }
            
            setIsLoading(false);
          }
        );

        // Then check for existing session
        const { data: { session } } = await supabase.auth.getSession();
        if (mounted) {
          if (session?.user) {
            setUser(session.user);
            setSession(session);
          }
          setIsLoading(false);
        }

        return () => {
          mounted = false;
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error('Auth initialization error:', error);
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    initializeAuth();

    return () => {
      mounted = false;
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
    isAdmin
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
