import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api } from '../lib/api';
import toast from 'react-hot-toast';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  churchId: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email: string, password: string) => {
        try {
          set({ isLoading: true });
          const response = await api.post('/auth/login', { email, password });
          const { access_token, user } = response.data;

          set({
            token: access_token,
            user,
            isAuthenticated: true,
            isLoading: false,
          });

          // Set token for future requests
          api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
          
          toast.success(`¡Bienvenido, ${user.firstName}!`);
        } catch (error: any) {
          set({ isLoading: false });
          const message = error.response?.data?.message || 'Error al iniciar sesión';
          toast.error(message);
          throw error;
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        });
        
        // Remove token from API headers
        delete api.defaults.headers.common['Authorization'];
        
        toast.success('Sesión cerrada correctamente');
      },

      refreshToken: async () => {
        try {
          const { token } = get();
          if (!token) return;

          const response = await api.post('/auth/refresh');
          const { access_token } = response.data;

          set({ token: access_token });
          api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
        } catch (error) {
          // If refresh fails, logout user
          get().logout();
        }
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.token) {
          api.defaults.headers.common['Authorization'] = `Bearer ${state.token}`;
        }
      },
    }
  )
);
