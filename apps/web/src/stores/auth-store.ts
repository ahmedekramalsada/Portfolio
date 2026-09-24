import { create } from 'zustand';
import { api } from '@/services/api';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  fetchMe: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isLoading: false,

  login: async (email: string, password: string) => {
    set({ isLoading: true });
    try {
      const res: any = await api.post('/auth/login', { email, password });
      set({ user: res.user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // ignore logout errors
    }
    set({ user: null, accessToken: null, isAuthenticated: false });
  },

  fetchMe: async () => {
    try {
      const res: any = await api.get('/auth/me');
      set({ user: res, isAuthenticated: true });
    } catch {
      set({ user: null, accessToken: null, isAuthenticated: false });
    }
  },
}));
