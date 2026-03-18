import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Usuario } from '../interfaces/Usuario';
import { Preferencias } from '../interfaces/Preferencias';

interface SessionState {
    isAuthenticated: boolean;
    userSession: Usuario | null;
    preferencias: Preferencias;
    login: (user: Usuario) => void;
    logout: () => void;
    toggleDarkMode: () => void;
}

export const useSessionStore = create<SessionState>()(
    persist(
        (set) => ({
            isAuthenticated: false,
            userSession: null,
            preferencias: { darkMode: false, language: 'es' },

            login: (user) => set({
                isAuthenticated: true,
                userSession: user
            }),

            logout: () => set({
                isAuthenticated: false,
                userSession: null,
                preferencias: { darkMode: false, language: 'es' } // Reset a default
            }),

            toggleDarkMode: () => set((state) => ({
                preferencias: { ...state.preferencias, darkMode: !state.preferencias.darkMode }
            })),
        }),
        {
            name: 'session-storage',
            storage: createJSONStorage(() => sessionStorage),
        }
    )
);