import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { useAuthStore } from '@/stores/auth-store'
import api from '@/lib/axios'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Users, 
  Calendar, 
  Home as HomeIcon, 
  Loader2, 
  Settings,
  LayoutDashboard,
  Bell,
  LogOut,
  User as UserIcon
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { LanguageToggle } from '@/components/elements/LanguageToggle'
import { ModeToggle } from '@/components/elements/ModeToggle'
import { useTranslation } from 'react-i18next'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export const Route = createFileRoute('/homes/$orgId')({
  component: FamilyHomePage,
})

function FamilyHomePage() {
  const { t } = useTranslation()
  const { orgId } = Route.useParams() as any
  const navigate = useNavigate()
  const { user, currentOrg, setOrg, logout } = useAuthStore()
  const [org, setOrgData] = useState<any>(null)
  const [members, setMembers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout')
    } catch (err) {
      console.error('Logout API failed:', err)
    } finally {
      logout()
      window.location.href = '/login'
    }
  }

  const fetchData = async () => {
    setLoading(true)
    try {
      // Correctly swap token if current store org doesn't match URL
      if (currentOrg?.id !== orgId) {
        const swapRes: any = await api.post('/auth/swap-token', { orgId })
        // After swap, the cookie is updated, now fetch data
        const [orgRes, membersRes] = await Promise.all([
          api.get(`/organizations/${orgId}`),
          api.get(`/organizations/${orgId}/members`)
        ])
        setOrgData(orgRes.data)
        setMembers(membersRes.data)
        
        // Sync store for this tab's actions
        setOrg({
          id: orgRes.data.id,
          name: orgRes.data.name,
          role: swapRes.data.role
        })
      } else {
        const [orgRes, membersRes] = await Promise.all([
          api.get(`/organizations/${orgId}`),
          api.get(`/organizations/${orgId}/members`)
        ])
        setOrgData(orgRes.data)
        setMembers(membersRes.data)
      }
    } catch (err) {
      console.error('Failed to fetch family data', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [orgId])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground animate-pulse font-medium tracking-tight">{t('homes.loading')}</p>
      </div>
    )
  }

  if (!org) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
        <h2 className="text-2xl font-bold">{t('homes.not_found')}</h2>
        <p className="text-muted-foreground mt-2 max-w-md">{t('homes.not_found_desc')}</p>
        <Button variant="ghost" className="mt-6" onClick={() => (window.location.href = '/dashboard')}>
          {t('homes.back_to_dashboard')}
        </Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Redesigned Standalone Home Header */}
      <header className="h-16 border-b flex items-center justify-between px-8 bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-6">
           <div className="flex items-center gap-2 group cursor-default">
              <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-black shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform duration-300">
                 {org.name.charAt(0)}
              </div>
              <div className="flex flex-col">
                <h1 className="font-black text-sm tracking-tight leading-none">{org.name}</h1>
                <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold mt-0.5">My Homie</span>
              </div>
           </div>
        </div>

        {/* Central Navigation Menu */}
        <nav className="hidden md:flex items-center bg-muted/50 p-1 rounded-xl border border-border/50">
          <Button variant="ghost" size="sm" className="bg-background shadow-sm h-8 px-4 font-bold text-xs rounded-lg">
            <LayoutDashboard className="mr-2 h-3.5 w-3.5" /> {t('org.context_global')}
          </Button>
          <Button variant="ghost" size="sm" className="h-8 px-4 font-bold text-xs text-muted-foreground hover:text-foreground rounded-lg">
            <Users className="mr-2 h-3.5 w-3.5" /> {t('homes.members_title')}
          </Button>
          <Button variant="ghost" size="sm" className="h-8 px-4 font-bold text-xs text-muted-foreground hover:text-foreground rounded-lg">
            <Settings className="mr-2 h-3.5 w-3.5" /> {t('homes.settings')}
          </Button>
        </nav>
        
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
              <Bell className="h-4 w-4" />
            </Button>
            <LanguageToggle />
            <ModeToggle />
          </div>
          <div className="h-4 w-px bg-border mx-1" />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className="flex items-center gap-2 pl-2 pr-1 h-9 rounded-full border bg-muted/20 hover:bg-muted/40 transition-colors"
              >
                <span className="text-xs font-bold px-1">{user?.name}</span>
                <div className="h-7 w-7 rounded-full bg-primary/10 border flex items-center justify-center text-[10px] font-black text-primary">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user?.name}</p>
                  <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate({ to: '/dashboard/profile' })}>
                <UserIcon className="mr-2 h-4 w-4" />
                <span>{t('common.profile')}</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => (window.location.href = '/dashboard')}>
                <LayoutDashboard className="mr-2 h-4 w-4" />
                <span>{t('homes.back_to_dashboard')}</span>
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

      <main className="flex-1 p-6 md:p-10">
        <div className="max-w-7xl mx-auto space-y-8 animate-reveal">
          {/* Hero Header Section */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b pb-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-primary">
                <HomeIcon className="h-5 w-5" />
                <span className="text-sm font-black uppercase tracking-widest">{t('homes.your_space')}</span>
              </div>
              <h1 className="text-5xl font-black tracking-tighter capitalize lg:text-7xl">
                {org.name}
              </h1>
              <p className="text-xl text-muted-foreground font-medium">
                {t('homes.welcome_back', { name: user?.name })}
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="h-12 px-6 font-bold rounded-xl border-2">
                <Settings className="mr-2 h-4 w-4" /> {t('homes.settings')}
              </Button>
              <Button className="h-12 px-8 font-black rounded-xl shadow-xl shadow-primary/20 bg-primary hover:scale-[1.02] transition-transform">
                {t('homes.invite')}
              </Button>
            </div>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Stats Cards */}
            <Card className="bg-primary/5 border-primary/20 shadow-none hover:shadow-xl transition-all duration-300 border-2">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-black uppercase tracking-widest flex items-center justify-between opacity-50">
                  {t('homes.members_title')}
                  <Users className="h-4 w-4 text-primary" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-5xl font-black">{members.length}</div>
                <p className="text-xs text-muted-foreground mt-2 font-bold uppercase tracking-wider">{t('homes.members_desc')}</p>
              </CardContent>
            </Card>

            <Card className="bg-green-500/5 border-green-500/20 shadow-none hover:shadow-xl transition-all duration-300 border-2">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-black uppercase tracking-widest flex items-center justify-between opacity-50">
                  {t('homes.upcoming_events')}
                  <Calendar className="h-4 w-4 text-green-500" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-5xl font-black">0</div>
                <p className="text-xs text-muted-foreground mt-2 font-bold uppercase tracking-wider">{t('homes.no_events')}</p>
              </CardContent>
            </Card>

            {/* Members List Section */}
            <Card className="md:col-span-2 lg:col-span-3 border-none bg-muted/30">
              <CardHeader className="px-8 pt-8 text-center sm:text-left">
                <CardTitle className="text-3xl font-black tracking-tight">{t('homes.members_list')}</CardTitle>
                <CardDescription className="text-lg font-medium">{t('homes.members_list_desc')}</CardDescription>
              </CardHeader>
              <CardContent className="px-8 pb-8">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {members.map((membership) => (
                    <div 
                      key={membership.id} 
                      className="flex items-center justify-between p-5 rounded-2xl bg-background border-2 shadow-sm hover:shadow-xl hover:border-primary/50 transition-all duration-300 group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center font-black text-primary border-2 border-primary/20 group-hover:scale-105 transition-transform">
                          {membership.user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="overflow-hidden">
                          <p className="font-black flex items-center gap-2 truncate text-lg">
                            {membership.user.name}
                            {membership.user.id === user?.id && (
                              <Badge key="me" variant="secondary" className="text-[10px] h-5 uppercase font-black px-2 leading-none bg-primary/10 text-primary border-none">
                                {t('homes.badge_me')}
                              </Badge>
                            )}
                          </p>
                          <p className="text-xs text-muted-foreground font-medium flex items-center gap-1 truncate">
                            {membership.user.email}
                          </p>
                        </div>
                      </div>
                      <div className="shrink-0">
                        <Badge variant={membership.role === 'ORG_ADMIN' ? 'default' : 'outline'} className="rounded-lg font-bold px-3 py-1">
                          {membership.role === 'ORG_ADMIN' ? t('org.role_admin') : t('org.role_member')}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
