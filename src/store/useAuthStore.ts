import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export type EstadoVenta = 'completada' | 'procesando' | 'pedida';

export interface Venta {
  nombre: string;
  tipo: EstadoVenta;
}

interface AuthState {
    isAuthenticated: boolean;
    ventas: Venta[];
    login: () => void;
    logout: () => void;
    addVenta: (venta: Venta) => void;
    clearVentas: () => void; // Acción manual para borrar si el usuario quiere
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            isAuthenticated: false,
            ventas: [],

            login: () => set({ isAuthenticated: true }),

            // AL MODIFICAR ESTO: Las ventas persisten aunque el usuario salga
            logout: () => set({ isAuthenticated: false }),

            addVenta: (nuevaVenta) => set((state) => ({
                ventas: [...state.ventas, nuevaVenta]
            })),

            clearVentas: () => set({ ventas: [] }),
        }),
        {
            name: 'auth-storage',
            // sessionStorage solo guarda durante sesión 
            // localStorage mantiene los datos tras cerrar sesión
            storage: createJSONStorage(() => localStorage),
        }
    )
)