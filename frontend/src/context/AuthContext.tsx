import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../lib/api';

export interface UserInfo {
  id: number;
  name: string;
  email: string;
  avatarUrl?: string;
  problemsSolved: number;
  currentStreak: number;
  contestRating: number;
}

interface AuthContextType {
  user: UserInfo | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUserStats: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
  const [user, setUser] = useState<UserInfo | null>(() => {
    try {
      const cached = localStorage.getItem('user');
      if (cached) return JSON.parse(cached);
    } catch (e) {}
    return null;
  });
  
  // Instant loading initialization — false if token and cached user exist!
  const [loading, setLoading] = useState<boolean>(() => {
    const cachedToken = localStorage.getItem('token');
    const cachedUser = localStorage.getItem('user');
    return Boolean(cachedToken && !cachedUser);
  });

  const fetchCurrentUser = async () => {
    try {
      const response = await api.get<UserInfo>('/auth/me');
      setUser(response.data);
      localStorage.setItem('user', JSON.stringify(response.data));
    } catch (error) {
      console.error('Failed to fetch user context:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token && !user) {
      fetchCurrentUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post<{ token: string; user: UserInfo }>('/auth/login', { email, password });
      const { token: receivedToken, user: receivedUser } = response.data;
      
      localStorage.setItem('token', receivedToken);
      localStorage.setItem('user', JSON.stringify(receivedUser));
      
      setUser(receivedUser);
      setToken(receivedToken);
      setLoading(false); // Instant transition without waiting for re-fetch
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const response = await api.post<{ token: string; user: UserInfo }>('/auth/register', { name, email, password });
      const { token: receivedToken, user: receivedUser } = response.data;
      
      localStorage.setItem('token', receivedToken);
      localStorage.setItem('user', JSON.stringify(receivedUser));
      
      setUser(receivedUser);
      setToken(receivedToken);
      setLoading(false); // Instant transition
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    setLoading(false);
  };

  const updateUserStats = async () => {
    if (!token) return;
    try {
      const response = await api.get<UserInfo>('/auth/me');
      setUser(response.data);
      localStorage.setItem('user', JSON.stringify(response.data));
    } catch (error) {
      console.error('Failed to update user stats:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, updateUserStats }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
