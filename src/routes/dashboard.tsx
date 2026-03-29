import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { DashboardLayout } from '@/layouts/DashboardLayout'
import { useAuthStore } from '@/stores/auth-store'

// _dashboard.tsx acts as a Layout Route. 
// Any route file starting with _dashboard_ will be wrapped by this.

export const Route = createFileRoute('/dashboard')({
  beforeLoad: () => {
    if (!useAuthStore.getState().isAuthenticated) {
      throw redirect({ to: '/login' })
    }
  },
  component: () => (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  ),
})
