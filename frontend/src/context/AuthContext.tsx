'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '../lib/types';
import { getToken, setToken, clearToken, decodeToken } from '../lib/auth';
import { authApi } from '../lib/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Wraps application and manages the current authenticated user context and state.
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setTokenState] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const savedToken = getToken();
    if (savedToken) {
      const decodedUser = decodeToken(savedToken);
      if (decodedUser) {
        setTokenState(savedToken);
        setUser(decodedUser);
      } else {
        clearToken();
      }
    }
    setLoading(false);
  }, []);

  // Handles client-side login sequence and routes the user based on their specific role.
  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const data = await authApi.login({ email, password });
      setToken(data.access_token);
      setTokenState(data.access_token);
      
      const decodedUser = decodeToken(data.access_token);
      setUser(decodedUser);
      setLoading(false);

      if (decodedUser?.role === 'admission_team') {
        router.push('/admission/dashboard');
      } else {
        router.push('/parent/dashboard');
      }
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  // Handles client-side parent registration sequence.
  const register = async (email: string, password: string, name: string) => {
    setLoading(true);
    try {
      await authApi.register({ email, password, name });
      await login(email, password);
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  // Clears user session data and redirects back to the login page.
  const logout = () => {
    clearToken();
    setTokenState(null);
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook that components can use to easily query current user details or trigger logout.
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
