
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { toast } from '@/components/ui/use-toast';

interface User {
  id: number;
  username: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  signup: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
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
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check for existing user in localStorage
    const storedUser = localStorage.getItem('avatarUser');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem('avatarUser');
      }
    }
    setLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      // Simulate API call
      // In a real app, this would make an actual API request
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock user database - in a real app, this would be server-side
      const mockUsers = JSON.parse(localStorage.getItem('avatarUsers') || '[]');
      const foundUser = mockUsers.find(
        (u: any) => u.username === username && u.password === password
      );
      
      if (foundUser) {
        const userData = { id: foundUser.id, username: foundUser.username };
        setUser(userData);
        localStorage.setItem('avatarUser', JSON.stringify(userData));
        toast({
          title: "Login successful",
          description: "Welcome back!",
        });
        return true;
      } else {
        toast({
          title: "Login failed",
          description: "Incorrect username or password",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login failed",
        description: "An error occurred during login",
        variant: "destructive",
      });
      return false;
    }
  };

  const signup = async (username: string, password: string): Promise<boolean> => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock user creation - in a real app, this would be server-side
      const mockUsers = JSON.parse(localStorage.getItem('avatarUsers') || '[]');
      
      // Check if username already exists
      if (mockUsers.some((u: any) => u.username === username)) {
        toast({
          title: "Signup failed",
          description: "Username already exists",
          variant: "destructive",
        });
        return false;
      }
      
      // Create new user
      const newUser = {
        id: mockUsers.length + 1,
        username,
        password,
      };
      
      mockUsers.push(newUser);
      localStorage.setItem('avatarUsers', JSON.stringify(mockUsers));
      
      toast({
        title: "Signup successful",
        description: "Your account has been created",
      });
      return true;
    } catch (error) {
      console.error('Signup error:', error);
      toast({
        title: "Signup failed",
        description: "An error occurred during signup",
        variant: "destructive",
      });
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('avatarUser');
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
  };

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
