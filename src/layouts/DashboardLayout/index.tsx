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

const NAV_ITEMS = [
  { label: 'common.dashboard', icon: LayoutDashboard, to: '/dashboard' },
  { label: 'Hồ sơ cá nhân', icon: User, to: '/dashboard/profile' },
  { label: 'common.users', icon: Users, to: '/dashboard/users' },
  { label: 'common.settings', icon: Settings, to: '/dashboard/settings' },
]

export function DashboardLayout({ children }: { children: ReactNode }) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()

  const handleLogout = () => {
    logout()
    navigate({ to: '/login' })
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
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-accent hover:text-accent-foreground"
              activeProps={{ className: 'bg-accent text-accent-foreground' }}
            >
              <item.icon className="h-4 w-4" />
              {item.label.startsWith('common.') ? t(item.label) : item.label}
            </Link>
          ))}
        </nav>
        <div className="border-t p-4">
          <Button 
            variant="ghost" 
            className="w-full justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/10" 
            size="sm"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            {t('common.logout')}
          </Button>
        </div>
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
            <div className="flex items-center gap-3 pl-2 border-l">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-medium">{user?.name || 'Người dùng'}</p>
                <p className="text-[10px] text-muted-foreground truncate max-w-[120px]">{user?.email}</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-primary/10 border flex items-center justify-center text-xs font-bold text-primary">
                {userInitial}
              </div>
            </div>
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
