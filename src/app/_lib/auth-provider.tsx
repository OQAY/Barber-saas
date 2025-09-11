"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  email: string;
  name: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  provider: string;
  image?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (authToken: string, userData: User) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Verificar se há token salvo ao carregar (apenas no cliente)
  useEffect(() => {
    // Verificar se estamos no cliente
    if (typeof window === 'undefined') {
      setLoading(false);
      return;
    }

    const checkAuth = () => {
      try {
        const token = localStorage.getItem('auth-token');
        if (token) {
          // Decodificar JWT para extrair dados do usuário
          const payload = JSON.parse(atob(token.split('.')[1]));
          
          // Verificar se token não expirou
          if (payload.exp && Date.now() >= payload.exp * 1000) {
            // Token expirou, remover
            localStorage.removeItem('auth-token');
          } else {
            // Token válido, restaurar usuário
            setUser({
              id: payload.userId,
              email: payload.email,
              name: payload.name,
              provider: payload.provider || 'email'
            });
          }
        }
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth-token');
        }
      } finally {
        setLoading(false);
      }
    };

    // Pequeno delay para garantir hidratação
    const timer = setTimeout(checkAuth, 100);
    return () => clearTimeout(timer);
  }, []);

  const login = (authToken: string, userData: User) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth-token', authToken);
    }
    setUser(userData);
  };

  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth-token');
    }
    setUser(null);
    router.push('/');
  };

  const value = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
}