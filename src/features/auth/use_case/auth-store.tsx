import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { login } from '../datasource/login';
import { Roles, User } from '../models/User';
import { register } from '../datasource/register';
import { getCollectors } from '../datasource/getCollectors';
import { setMockData } from '../datasource/setMockData';
import { updateUserRol } from '../datasource/updateUserRol';

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isLoading?: boolean;
  login: (email: string, password:string) => Promise<boolean>;
  logout: () => void;
  register: (userData: Partial<User>) => Promise<boolean>;
  loginError: string | null;
  registerError: string | null;
  getCollectors: () => Promise<User[]>;
  users: User[];
  fillWithMockData: () => Promise<void>;
  updateUserRol: (userId: string, newRole: Roles) => Promise<boolean>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      user: null,
      isLoading: false,
      loginError: null,
      registerError: null,
      users: [],
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
      getCollectors: async() => {
        return await getCollectors()
      },
      fillWithMockData: async () => {
        const mockData = await setMockData()
        set({ users: mockData })
      },
      updateUserRol: async (userId: string, newRole: Roles) => {
        await updateUserRol(userId, newRole)
        const updatedUsers: User[] = (get().users ?? [])?.map(user => {
          if (user.id === userId) {
            return { ...user, role: newRole }
          }
          return user
        })
        set({ users: updatedUsers })
        return true;
      },
    }),
    {
      name: 'residuos-auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        users: state.users,
      }),
      version: 1,
    }
  )
);