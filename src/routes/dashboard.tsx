import { createFileRoute, Outlet } from '@tanstack/react-router'
import { DashboardLayout } from '@/layouts/DashboardLayout'

// _dashboard.tsx acts as a Layout Route. 
// Any route file starting with _dashboard_ will be wrapped by this.

export const Route = createFileRoute('/dashboard')({
  component: () => (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  ),
})
