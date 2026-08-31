import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { clearTokens, saveTokens } from '@/lib/token-storage';
import {
  loginRequest,
  registerRequest,
} from '@/services/auth/api';
import type { LoginPayload, RegisterPayload } from '@/services/auth/types';

type AuthState = {
  accessToken: string | null;
  refreshToken: string | null;
  email: string | null;
  isAuthenticated: boolean;
  _hasHydrated: boolean;
  setHasHydrated: (value: boolean) => void;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
  setTokens: (accessToken: string, refreshToken: string, email: string) => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      email: null,
      isAuthenticated: false,
      _hasHydrated: false,

      setHasHydrated: (value) => set({ _hasHydrated: value }),

      setTokens: (accessToken, refreshToken, email) => {
        set({ accessToken, refreshToken, email, isAuthenticated: true });
      },

      login: async (payload) => {
        const data = await loginRequest(payload);
        await saveTokens(data.access_token, data.refresh_token);
        set({
          accessToken: data.access_token,
          refreshToken: data.refresh_token,
          email: payload.email,
          isAuthenticated: true,
        });
      },

      register: async (payload) => {
        await registerRequest(payload);
      },

      logout: async () => {
        await clearTokens();
        set({
          accessToken: null,
          refreshToken: null,
          email: null,
          isAuthenticated: false,
        });
      },
    }),
    {
      name: 'medos-auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
