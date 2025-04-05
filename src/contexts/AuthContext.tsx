
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';
import { toast } from '@/components/ui/use-toast';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check URL for access_token and refresh_token (from email confirmation)
    const handleEmailConfirmation = async () => {
      const url = new URL(window.location.href);
      const accessToken = url.searchParams.get('access_token');
      const refreshToken = url.searchParams.get('refresh_token');
      const errorCode = url.searchParams.get('error_code');
      const error = url.searchParams.get('error_description');

      if (errorCode || error) {
        console.error('Email confirmation error:', error);
        toast({
          title: "Confirmation error",
          description: error || "There was an error confirming your email",
          variant: "destructive",
        });
        return;
      }

      if (accessToken && refreshToken) {
        const { data, error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });
        
        if (error) {
          console.error('Error setting session:', error);
          toast({
            title: "Authentication error",
            description: error.message,
            variant: "destructive",
          });
        } else if (data.session) {
          setSession(data.session);
          setUser(data.session.user);
          toast({
            title: "Email confirmed",
            description: "Your email has been confirmed successfully!",
          });
          // Clean up URL parameters
          window.history.replaceState({}, document.title, window.location.pathname);
        }
      }
    };

    handleEmailConfirmation();

    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event);
      setSession(session);
      setUser(session?.user ?? null);
      
      if (event === 'SIGNED_IN') {
        toast({
          title: "Logged in successfully",
          description: `Welcome${session?.user?.email ? ', ' + session.user.email : ''}!`,
        });
      } else if (event === 'SIGNED_OUT') {
        toast({
          title: "Logged out",
          description: "You have been logged out successfully",
        });
      } else if (event === 'USER_UPDATED') {
        toast({
          title: "Account updated",
          description: "Your account has been updated successfully",
        });
      }
    });

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error('Login error:', error);
        toast({
          title: "Login failed",
          description: error.message,
          variant: "destructive",
        });
        return false;
      }
      
      // The session will be updated via the onAuthStateChange listener
      return true;
    } catch (error) {
      console.error('Unexpected login error:', error);
      toast({
        title: "Login failed",
        description: "An unexpected error occurred during login",
        variant: "destructive",
      });
      return false;
    }
  };

  const signup = async (email: string, password: string): Promise<boolean> => {
    try {
      // Use redirectTo to specify where users should be sent after clicking the confirmation link
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin + '/login', // Redirect to login page after confirmation
        }
      });
      
      if (error) {
        console.error('Signup error:', error);
        toast({
          title: "Signup failed",
          description: error.message,
          variant: "destructive",
        });
        return false;
      }
      
      toast({
        title: "Signup successful",
        description: "Your account has been created. Check your email for confirmation.",
      });
      return true;
    } catch (error) {
      console.error('Unexpected signup error:', error);
      toast({
        title: "Signup failed",
        description: "An unexpected error occurred during signup",
        variant: "destructive",
      });
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await supabase.auth.signOut();
      // The session will be updated via the onAuthStateChange listener
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: "Logout failed",
        description: "An error occurred during logout",
        variant: "destructive",
      });
    }
  };

  const value = {
    user,
    session,
    loading,
    login,
    signup,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
