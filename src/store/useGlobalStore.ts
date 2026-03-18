import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { Usuario } from '../interfaces/Usuario';
import { Venta } from '../interfaces/Venta';

interface GlobalState {
    usuarios: Usuario[];
    ventas: Venta[];
    registrarUsuario: (usuario: Usuario) => void;
    addVenta: (venta: Venta) => void;
    clearVentas: () => void;
}

export const useGlobalStore = create<GlobalState>()(
    persist(
        (set) => ({
            usuarios: [],
            ventas: [],
            registrarUsuario: (nuevo) => set((state) => ({ usuarios: [...state.usuarios, nuevo] })),
            addVenta: (nueva) => set((state) => ({ ventas: [...state.ventas, nueva] })),
            clearVentas: () => set({ ventas: [] }),
        }),
        {
            name: 'global-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);