import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface User {
  id: string
  email: string
  fullName: string
  avatarUrl?: string
}

interface Organization {
  id: string
  name: string
  role: 'ORG_ADMIN' | 'ORG_MEMBER'
}

interface AuthState {
  user: User | null
  currentOrg: Organization | null
  isAuthenticated: boolean
  setAuth: (user: User, currentOrg: Organization | null) => void
  setOrg: (org: Organization) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      currentOrg: null,
      isAuthenticated: false,
      setAuth: (user, currentOrg) => set({ user, currentOrg, isAuthenticated: true }),
      setOrg: (currentOrg) => set({ currentOrg }),
      logout: () => set({ user: null, currentOrg: null, isAuthenticated: false }),
    }),
    {
      name: 'homie-auth-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
