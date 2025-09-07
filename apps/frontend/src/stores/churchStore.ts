import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api } from '../lib/api';

interface Church {
  id: string;
  name: string;
  address?: string;
  phone?: string;
  email?: string;
  pastor?: string;
  description?: string;
  organizationId?: string;
  organization?: Organization;
  role: string;
  isPrimary: boolean;
  canAccess: boolean;
}

interface Organization {
  id: string;
  name: string;
  description?: string;
}

interface ChurchState {
  selectedChurch: Church | null;
  availableChurches: Church[];
  loading: boolean;
  error: string | null;
  
  // Actions
  selectChurch: (churchId: string) => Promise<void>;
  fetchAvailableChurches: () => Promise<void>;
  clearChurchData: () => void;
  getSelectedChurchId: () => string | null;
}

export const useChurchStore = create<ChurchState>()(
  persist(
    (set, get) => ({
      selectedChurch: null,
      availableChurches: [],
      loading: false,
      error: null,

      selectChurch: async (churchId: string) => {
        set({ loading: true, error: null });
        try {
          // Llamar al endpoint para seleccionar la iglesia
          await api.post('/users/select-church', { churchId });
          
          // Encontrar la iglesia seleccionada en las disponibles
          const selectedChurch = get().availableChurches.find(church => church.id === churchId);
          
          if (selectedChurch) {
            set({ selectedChurch, loading: false });
          } else {
            set({ error: 'Iglesia no encontrada', loading: false });
          }
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 'Error al seleccionar iglesia';
          set({ error: errorMessage, loading: false });
          console.error('Error al seleccionar iglesia:', error);
        }
      },

      fetchAvailableChurches: async () => {
        set({ loading: true, error: null });
        try {
          const response = await api.get('/users/available-churches');
          const data = response.data;
          
          // Manejar nueva estructura de respuesta
          const churches = data.churches || data; // Compatibilidad con respuesta anterior
          const hasAccess = data.hasAccess !== false; // Por defecto true si no está definido
          const message = data.message;
          
          set({ 
            availableChurches: churches,
            loading: false,
            error: !hasAccess ? message : null
          });

          // Si no hay iglesia seleccionada y hay iglesias disponibles, seleccionar la primera (principal)
          if (!get().selectedChurch && churches.length > 0 && hasAccess) {
            const primaryChurch = churches.find((church: Church) => church.isPrimary) || churches[0];
            await get().selectChurch(primaryChurch.id);
          }
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || 'Error al obtener iglesias disponibles';
          set({ error: errorMessage, loading: false });
          console.error('Error al obtener iglesias disponibles:', error);
        }
      },

      clearChurchData: () => {
        set({
          selectedChurch: null,
          availableChurches: [],
          error: null,
        });
      },

      getSelectedChurchId: () => {
        return get().selectedChurch?.id || null;
      },
    }),
    {
      name: 'church-storage',
      partialize: (state) => ({
        selectedChurch: state.selectedChurch,
        availableChurches: state.availableChurches,
      }),
    }
  )
);
