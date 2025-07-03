import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  isVerified: boolean;
  profilePicture?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<boolean>;
  resetPassword: (token: string, password: string) => Promise<boolean>;
  updateProfile: (data: Partial<User>) => Promise<boolean>;
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

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const storedUser = localStorage.getItem('mindcare_user');
    const storedToken = localStorage.getItem('mindcare_token');
    
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Simulate API call
      const users = JSON.parse(localStorage.getItem('mindcare_users') || '[]');
      const foundUser = users.find((u: any) => u.email === email && u.password === password);
      
      if (foundUser && foundUser.isVerified) {
        const userToken = 'jwt_token_' + Math.random().toString(36).substr(2, 9);
        const userData = {
          id: foundUser.id,
          email: foundUser.email,
          name: foundUser.name,
          isVerified: foundUser.isVerified,
          profilePicture: foundUser.profilePicture
        };
        
        localStorage.setItem('mindcare_token', userToken);
        localStorage.setItem('mindcare_user', JSON.stringify(userData));
        setUser(userData);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      const users = JSON.parse(localStorage.getItem('mindcare_users') || '[]');
      
      // Check if user already exists
      if (users.find((u: any) => u.email === email)) {
        return false;
      }

      const newUser = {
        id: Math.random().toString(36).substr(2, 9),
        name,
        email,
        password,
        isVerified: true, // For demo purposes, auto-verify
        profilePicture: null,
        createdAt: new Date().toISOString()
      };

      users.push(newUser);
      localStorage.setItem('mindcare_users', JSON.stringify(users));
      
      // Auto-login after registration
      const userData = {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        isVerified: newUser.isVerified,
        profilePicture: newUser.profilePicture
      };
      
      const userToken = 'jwt_token_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('mindcare_token', userToken);
      localStorage.setItem('mindcare_user', JSON.stringify(userData));
      setUser(userData);
      
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('mindcare_token');
    localStorage.removeItem('mindcare_user');
    setUser(null);
  };

  const forgotPassword = async (email: string): Promise<boolean> => {
    try {
      // Simulate sending password reset email
      const users = JSON.parse(localStorage.getItem('mindcare_users') || '[]');
      return users.some((u: any) => u.email === email);
    } catch (error) {
      console.error('Forgot password error:', error);
      return false;
    }
  };

  const resetPassword = async (token: string, password: string): Promise<boolean> => {
    try {
      // Simulate password reset
      return true;
    } catch (error) {
      console.error('Reset password error:', error);
      return false;
    }
  };

  const updateProfile = async (data: Partial<User>): Promise<boolean> => {
    try {
      if (!user) return false;
      
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      localStorage.setItem('mindcare_user', JSON.stringify(updatedUser));
      
      // Update in users array
      const users = JSON.parse(localStorage.getItem('mindcare_users') || '[]');
      const userIndex = users.findIndex((u: any) => u.id === user.id);
      if (userIndex !== -1) {
        users[userIndex] = { ...users[userIndex], ...data };
        localStorage.setItem('mindcare_users', JSON.stringify(users));
      }
      
      return true;
    } catch (error) {
      console.error('Update profile error:', error);
      return false;
    }
  };

  const value = {
    user,
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
    updateProfile,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};