import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { login } from '../datasource/login';
import { User } from '../models/User';
import { register } from '../datasource/register';

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isLoading?: boolean;
  login: (email: string, password:string) => Promise<boolean>;
  logout: () => void;
  register: (userData: Partial<User>) => Promise<boolean>;
  loginError: string | null;
  registerError: string | null;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      isLoading: false,
      loginError: null,
      registerError: null,
      login: async(email, password) => {
        try {
          set({ isLoading: true, loginError: null });
          const loggedInUser = await login(email, password);
          set({
            isAuthenticated: true,
            user: loggedInUser,
          });
          return true;
        } catch (error) {
          console.error(error)
          set({ loginError: "Correo o contraseña inválidos" });
          return false;
        } finally {
          set({ isLoading: false });
        }
      },
      register: async(userData) => {
        try {
          set({ isLoading: true, registerError: null });
          const result = await register(userData);
          if (result) {
            return true;
          }
          set({ registerError: "Error en el registro" });
          return false;
        } catch (e) {
          console.error(e)
          set({ registerError: "Error en el registro" });
          return false;
        } finally {
          set({ isLoading: false });
        }
      },
      logout: () =>
        set({
          isAuthenticated: false,
          user: null,
          loginError: null,
          registerError: null,
        }),
    }),
    {
      name: 'residuos-auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
      }),
      version: 1,
    }
  )
);