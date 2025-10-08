import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for saved session
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Get passwords from environment variables
    const senhaApp = import.meta.env.VITE_SENHA_APP;
    const senhaPremium = import.meta.env.VITE_SENHA_PREMIUM;
    
    // Validate password
    let isPremium = false;
    let isValid = false;
    
    if (password === senhaPremium) {
      isPremium = true;
      isValid = true;
    } else if (password === senhaApp) {
      isPremium = false;
      isValid = true;
    }
    
    if (!isValid) {
      setIsLoading(false);
      throw new Error('Senha incorreta');
    }
    
    const user: User = {
      id: '1',
      email,
      name: email.split('@')[0],
      isPremium,
    };
    
    setUser(user);
    localStorage.setItem('user', JSON.stringify(user));
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};