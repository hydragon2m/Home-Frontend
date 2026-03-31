import type { ReactNode } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { 
  Settings, 
  LogOut, 
  Bell, 
  User
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTranslation } from 'react-i18next'
import { LanguageToggle } from '@/components/elements/LanguageToggle'
import { ModeToggle } from '@/components/elements/ModeToggle'
import { useAuthStore } from '@/stores/auth-store'
import { OrganizationSwitcher } from '@/components/elements/OrganizationSwitcher'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import api from '@/lib/axios'

export function DashboardLayout({ children }: { children: ReactNode }) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout')
    } catch (err) {
      console.error('Logout API failed:', err)
    } finally {
      logout()
      navigate({ to: '/login' })
    }
  }

  const userInitial = user?.name?.charAt(0).toUpperCase() || 'U'

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-muted/20">
      {/* Dashboard Global Topbar */}
      <header className="flex h-16 items-center justify-between border-b bg-background px-6 shrink-0 shadow-sm z-10">
        <div className="flex items-center gap-6">
          <Link to="/" className="font-bold text-xl tracking-tighter text-primary">
            Homie
          </Link>
          <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground bg-muted px-2 py-1 rounded">
            Dashboard
          </span>
          <div className="h-4 w-px bg-border mx-1" />
          <OrganizationSwitcher />
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2">
            <LanguageToggle />
            <ModeToggle />
          </div>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-2 right-2 flex h-2 w-2 rounded-full bg-destructive" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center gap-3 pl-2 border-l cursor-pointer hover:bg-muted/50 transition-colors p-1 rounded-lg">
                <div className="text-right hidden sm:block">
                  <p className="text-xs font-medium">{user?.name || 'User'}</p>
                  <p className="text-[10px] text-muted-foreground truncate max-w-[120px]">{user?.email}</p>
                </div>
                <div className="h-8 w-8 rounded-full bg-primary/10 border flex items-center justify-center text-xs font-bold text-primary">
                  {userInitial}
                </div>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user?.name}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate({ to: '/dashboard/profile' })}>
                <User className="mr-2 h-4 w-4" />
                <span>{t('common.profile')}</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate({ to: '/dashboard/settings/organization' })}>
                <Settings className="mr-2 h-4 w-4" />
                <span>{t('common.settings_system')}</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="text-destructive focus:text-destructive focus:bg-destructive/10"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>{t('common.logout')}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Page Content */}
      <main className="flex-1 overflow-y-auto p-6 md:p-8">
        <div className="mx-auto w-full max-w-5xl">
          {children}
        </div>
      </main>
    </div>
  )
}
