import type { ReactNode } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  LogOut, 
  Bell, 
  Menu,
  User 
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTranslation } from 'react-i18next'
import { LanguageToggle } from '@/components/elements/LanguageToggle'
import { ModeToggle } from '@/components/elements/ModeToggle'
import { OrganizationSwitcher } from '@/components/elements/OrganizationSwitcher'
import { useAuthStore } from '@/stores/auth-store'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import api from '@/lib/axios'

const getNavItems = (orgId?: string) => [
  { 
    label: 'common.dashboard', 
    icon: LayoutDashboard, 
    to: orgId ? '/dashboard/homes/$orgId' : '/dashboard',
    params: orgId ? { orgId } : undefined
  },
  { 
    label: 'common.users', 
    icon: Users, 
    to: orgId ? '/dashboard/homes/$orgId' : '/dashboard', // For now, point to the same family home as it has members
    params: orgId ? { orgId } : undefined
  },
]

export function DashboardLayout({ children }: { children: ReactNode }) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { user, currentOrg, logout } = useAuthStore()
  const navItems = getNavItems(currentOrg?.id)

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
    <div className="flex h-screen overflow-hidden bg-muted/20">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex w-64 flex-col border-r bg-background">
        <div className="flex h-16 items-center border-b px-6 text-primary">
          <Link to="/" className="font-bold text-2xl tracking-tighter">
            Homie
          </Link>
        </div>
        
        <OrganizationSwitcher />
        
        <nav className="flex-1 space-y-1 p-4">
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              params={item.params as any}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-accent hover:text-accent-foreground"
              activeProps={{ className: 'bg-accent text-accent-foreground' }}
            >
              <item.icon className="h-4 w-4" />
              {item.label.startsWith('common.') ? t(item.label) : item.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Topbar */}
        <header className="flex h-16 items-center justify-between border-b bg-background px-6">
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
          <div className="ml-auto flex items-center gap-4">
            <LanguageToggle />
            <ModeToggle />
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-2 right-2 flex h-2 w-2 rounded-full bg-destructive" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex items-center gap-3 pl-2 border-l cursor-pointer hover:bg-muted/50 transition-colors p-1 rounded-lg">
                  <div className="text-right hidden sm:block">
                    <p className="text-xs font-medium">{user?.name || 'Người dùng'}</p>
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
          <div className="mx-auto max-w-6xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
