import { createRootRoute, Outlet } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { ScrollToTop } from '@/components/elements/ScrollToTop'
import { useAuthStore } from '@/stores/auth-store'
import api from '@/lib/axios'

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  const { setAuth, logout } = useAuthStore()
  const [initializing, setInitializing] = useState(true)

  useEffect(() => {
    const initAuth = async () => {
      try {
        const res = await api.get('/users/me')
        setAuth(res.data, res.data.orgId || null)
      } catch (err) {
        logout()
      } finally {
        setInitializing(false)
      }
    }

    initAuth()
  }, [setAuth, logout])

  if (initializing) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-medium animate-pulse">Đang khởi tạo ngôi nhà của bạn...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <Outlet />
      <ScrollToTop />
    </>
  )
}
