import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState, useEffect, useRef } from 'react'
import { useAuthStore } from '@/stores/auth-store'
import api from '@/lib/axios'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Users, 
  Calendar, 
  Loader2, 
  Settings,
  LayoutDashboard,
  Bell,
  LogOut,
  User as UserIcon,
  LayoutGrid,
  Wallet,
  CheckSquare,
  Layout,
  Music,
  Camera,
  Folder,
  Phone,
  Mail,
  MessageSquare,
  Heart,
  Shield,
  ShoppingBag,
  Zap,
  Gamepad2,
  Cloud,
  Video,
  Map,
  Mic,
  Languages,
  Activity,
  Package,
  Coffee,
  Car,
  Plane,
  Target,
  Star,
  Palette,
  Search,
  ShoppingCart,
  Wind,
  ChevronUp,
  X
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

  // --- Assistive DOCK Logic ---
  const [isDockOpen, setIsDockOpen] = useState(false)
  const [isAllAppsOpen, setIsAllAppsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [pos, setPos] = useState({ x: window.innerWidth - 80, y: window.innerHeight - 150 })
  const [isDragging, setIsDragging] = useState(false)
  const [currentPage, setCurrentPage] = useState(0)
  const scrollRef = useRef<HTMLDivElement>(null)

  const apps = [
    { id: 'dashboard', icon: LayoutGrid, label: t('org.context_global'), color: 'bg-blue-500', path: '/dashboard', badge: 0 },
    { id: 'members', icon: Users, label: t('homes.members_title'), color: 'bg-green-500', path: `/homes/${orgId}/members`, badge: members.length },
    { id: 'finance', icon: Wallet, label: t('common.features.finance.title'), color: 'bg-orange-500', path: `/homes/${orgId}/finance`, badge: 0 },
    { id: 'calendar', icon: Calendar, label: t('common.features.calendar.title'), color: 'bg-purple-500', path: `/homes/${orgId}/calendar`, badge: 2 },
    { id: 'tasks', icon: CheckSquare, label: t('common.features.todo.title'), color: 'bg-pink-500', path: `/homes/${orgId}/tasks`, badge: 5 },
    { id: 'settings', icon: Settings, label: t('homes.settings'), color: 'bg-gray-500', path: `/homes/${orgId}/settings`, badge: 0 },
    { id: 'devices', icon: Layout, label: t('common.features.devices.title') || 'Thiết bị', color: 'bg-cyan-500', path: `/homes/${orgId}/devices`, badge: 1 },
    { id: 'music', icon: Music, label: 'Nhạc', color: 'bg-rose-500', path: `/homes/${orgId}/music`, badge: 0 },
    { id: 'camera', icon: Camera, label: 'Ảnh', color: 'bg-orange-400', path: `/homes/${orgId}/camera`, badge: 0 },
    { id: 'folder', icon: Folder, label: 'Tệp', color: 'bg-blue-400', path: `/homes/${orgId}/files`, badge: 0 },
    { id: 'phone', icon: Phone, label: 'Gọi điện', color: 'bg-emerald-500', path: `/homes/${orgId}/phone`, badge: 0 },
    { id: 'mail', icon: Mail, label: 'Email', color: 'bg-sky-500', path: `/homes/${orgId}/mail`, badge: 12 },
    { id: 'message', icon: MessageSquare, label: 'Tin nhắn', color: 'bg-green-400', path: `/homes/${orgId}/messages`, badge: 3 },
    { id: 'health', icon: Heart, label: 'Sức khỏe', color: 'bg-red-500', path: `/homes/${orgId}/health`, badge: 0 },
    { id: 'security', icon: Shield, label: 'Bảo mật', color: 'bg-indigo-600', path: `/homes/${orgId}/security`, badge: 0 },
    { id: 'shop', icon: ShoppingBag, label: 'Cửa hàng', color: 'bg-amber-500', path: `/homes/${orgId}/shop`, badge: 0 },
    { id: 'energy', icon: Zap, label: 'Điện năng', color: 'bg-yellow-400', path: `/homes/${orgId}/energy`, badge: 0 },
    { id: 'games', icon: Gamepad2, label: 'Trò chơi', color: 'bg-purple-400', path: `/homes/${orgId}/games`, badge: 0 },
    { id: 'cloud', icon: Cloud, label: 'Lưu trữ', color: 'bg-blue-300', path: `/homes/${orgId}/cloud`, badge: 0 },
    { id: 'video', icon: Video, label: 'Video', color: 'bg-red-400', path: `/homes/${orgId}/video`, badge: 0 },
    { id: 'map', icon: Map, label: 'Bản đồ', color: 'bg-emerald-400', path: `/homes/${orgId}/map`, badge: 0 },
    { id: 'mic', icon: Mic, label: 'Ghi âm', color: 'bg-orange-600', path: `/homes/${orgId}/recorder`, badge: 0 },
    { id: 'lang', icon: Languages, label: 'Ngôn ngữ', color: 'bg-teal-500', path: `/homes/${orgId}/language`, badge: 0 },
    { id: 'activity', icon: Activity, label: 'Hoạt động', color: 'bg-fuchsia-500', path: `/homes/${orgId}/activity`, badge: 0 },
    { id: 'package', icon: Package, label: 'Kiện hàng', color: 'bg-amber-600', path: `/homes/${orgId}/shipping`, badge: 0 },
    { id: 'coffee', icon: Coffee, label: 'Cà phê', color: 'bg-amber-800', path: `/homes/${orgId}/coffee`, badge: 0 },
    { id: 'car', icon: Car, label: 'Xe cộ', color: 'bg-slate-700', path: `/homes/${orgId}/car`, badge: 0 },
    { id: 'plane', icon: Plane, label: 'Du lịch', color: 'bg-sky-400', path: `/homes/${orgId}/travel`, badge: 0 },
    { id: 'target', icon: Target, label: 'Mục tiêu', color: 'bg-rose-600', path: `/homes/${orgId}/goals`, badge: 0 },
    { id: 'star', icon: Star, label: 'Yêu thích', color: 'bg-yellow-500', path: `/homes/${orgId}/favorites`, badge: 0 },
    { id: 'paint', icon: Palette, label: 'Chủ đề', color: 'bg-indigo-400', path: `/homes/${orgId}/themes`, badge: 0 },
    { id: 'search', icon: Search, label: 'Tìm kiếm', color: 'bg-gray-400', path: `/homes/${orgId}/search`, badge: 0 },
    { id: 'cart', icon: ShoppingCart, label: 'Giỏ hàng', color: 'bg-orange-500', path: `/homes/${orgId}/cart`, badge: 0 },
    { id: 'wind', icon: Wind, label: 'Thời tiết', color: 'bg-blue-200', path: `/homes/${orgId}/weather`, badge: 0 },
  ]

  const filteredApps = apps.filter(app => 
    app.label.toLowerCase().includes(searchQuery.toLowerCase()) || 
    app.id.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Pagination config (6 apps per page)
  const itemsPerPage = 6
  const totalPages = Math.ceil(apps.length / itemsPerPage)

  const handleScroll = (e: any) => {
    const scrollLeft = e.target.scrollLeft
    const width = e.target.clientWidth
    if (width > 0) {
      const newPage = Math.round(scrollLeft / width)
      if (newPage !== currentPage) setCurrentPage(newPage)
    }
  }

  // Improved Wheel Scroll Logic: Scroll per page (next/prev) on each notch
  const lastWheelTime = useRef(0)
  useEffect(() => {
    const el = scrollRef.current
    if (!el || !isDockOpen) return

    const wheelHandler = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return
      e.preventDefault()

      const now = Date.now()
      if (now - lastWheelTime.current < 400) return // Debounce for smooth page turns

      if (e.deltaY > 0) {
        scrollToPage(Math.min(currentPage + 1, totalPages - 1))
        lastWheelTime.current = now
      } else if (e.deltaY < 0) {
        scrollToPage(Math.max(currentPage - 1, 0))
        lastWheelTime.current = now
      }
    }

    el.addEventListener('wheel', wheelHandler, { passive: false })
    return () => el.removeEventListener('wheel', wheelHandler)
  }, [isDockOpen, currentPage, totalPages])

  const scrollToPage = (pageIdx: number) => {
    if (scrollRef.current) {
      const width = scrollRef.current.clientWidth
      scrollRef.current.scrollTo({
        left: pageIdx * width,
        behavior: 'smooth'
      })
      setCurrentPage(pageIdx)
    }
  }

  const handleMouseDown = (e: any) => {
    setIsDragging(false)
    const clientX = e.clientX || e.touches?.[0]?.clientX
    const clientY = e.clientY || e.touches?.[0]?.clientY
    
    const moveHandler = (moveEvent: any) => {
      setIsDragging(true)
      const mX = moveEvent.clientX || moveEvent.touches?.[0]?.clientX
      const mY = moveEvent.clientY || moveEvent.touches?.[0]?.clientY
      setPos({ x: mX - (clientX - pos.x), y: mY - (clientY - pos.y) })
    }

    const upHandler = () => {
      setPos(current => {
        const snapX = current.x < window.innerWidth / 2 ? 16 : window.innerWidth - 76
        return { x: snapX, y: Math.max(80, Math.min(window.innerHeight - 80, current.y)) }
      })
      window.removeEventListener('mousemove', moveHandler)
      window.removeEventListener('mouseup', upHandler)
      window.removeEventListener('touchmove', moveHandler)
      window.removeEventListener('touchend', upHandler)
    }

    window.addEventListener('mousemove', moveHandler)
    window.addEventListener('mouseup', upHandler)
    window.addEventListener('touchmove', moveHandler)
    window.addEventListener('touchend', upHandler)
  }

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
      if (currentOrg?.id !== orgId) {
        const swapRes: any = await api.post('/auth/swap-token', { orgId })
        const [orgRes, membersRes] = await Promise.all([
          api.get(`/organizations/${orgId}`),
          api.get(`/organizations/${orgId}/members`)
        ])
        setOrgData(orgRes.data)
        setMembers(membersRes.data)
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
        <p className="text-muted-foreground animate-pulse font-medium tracking-tight">{t("homes.loading")}</p>
      </div>
    )
  }

  if (!org) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
        <h2 className="text-2xl font-bold">{t("homes.not_found")}</h2>
        <p className="text-muted-foreground mt-2 max-w-md">{t("homes.not_found_desc")}</p>
        <Button variant="ghost" className="mt-6" onClick={() => (window.location.href = "/dashboard")}>
          {t('homes.back_to_dashboard')}
        </Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      <header className="h-16 border-b flex items-center justify-between px-6 bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-6">
           <div className="flex items-center gap-2 group cursor-default">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-black shadow-lg shadow-primary/10 group-hover:scale-105 transition-transform duration-300">
                 {org.name.charAt(0)}
              </div>
              <div className="flex flex-col">
                <h1 className="font-bold text-xs tracking-tight leading-none">{org.name}</h1>
                <span className="text-[9px] text-muted-foreground uppercase tracking-widest font-black mt-0.5">My Homie</span>
              </div>
           </div>
        </div>
        
        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-0.5">
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
                className="flex items-center gap-2 pl-1.5 pr-0.5 h-8 rounded-full border bg-muted/20 hover:bg-muted/30 transition-colors"
              >
                <span className="text-[11px] font-bold px-1">{user?.name}</span>
                <div className="h-6 w-6 rounded-full bg-primary/10 border flex items-center justify-center text-[9px] font-black text-primary">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              <DropdownMenuLabel className="py-2">
                <div className="flex flex-col space-y-0.5">
                  <p className="text-sm font-bold leading-none">{user?.name}</p>
                  <p className="text-[10px] leading-none text-muted-foreground">{user?.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate({ to: '/dashboard/profile' })}>
                <UserIcon className="mr-2 h-4 w-4" />
                <span className="text-sm">{t("common.profile")}</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => (window.location.href = '/dashboard')}>
                <LayoutDashboard className="mr-2 h-4 w-4" />
                <span className="text-sm">{t("homes.back_to_dashboard")}</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="text-destructive focus:text-destructive focus:bg-destructive/10"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span className="text-sm">{t("common.logout")}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <main className="flex-1 p-4 md:p-8 pb-32">
        <div className="max-w-6xl mx-auto space-y-6 animate-reveal">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b pb-6">
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-primary">
                <Layout className="h-4 w-4" />
                <span className="text-[11px] font-black uppercase tracking-widest">{t("homes.your_space")}</span>
              </div>
              <h1 className="text-3xl font-black tracking-tight capitalize lg:text-4xl">
                {org.name}
              </h1>
              <p className="text-base text-muted-foreground font-medium">
                {t('homes.welcome_back', { name: user?.name })}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="h-10 px-4 font-bold rounded-lg border-2 hover:bg-primary/5 transition-colors" onClick={() => navigate({ to: `/homes/${orgId}/settings` as any })}>
                <Settings className="mr-2 h-3.5 w-3.5" /> {t("homes.settings")}
              </Button>
              <Button className="h-10 px-6 font-black rounded-lg shadow-lg shadow-primary/20 bg-primary hover:scale-[1.02] active:scale-95 transition-all">
                {t('homes.invite')}
              </Button>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="bg-primary/5 border-primary/20 shadow-none hover:shadow-md transition-all duration-300 border-2">
              <CardHeader className="pb-1.5">
                <CardTitle className="text-[10px] font-black uppercase tracking-widest flex items-center justify-between opacity-50">
                  {t('homes.members_title')}
                  <Users className="h-3.5 w-3.5 text-primary" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-black">{members.length}</div>
                <p className="text-[10px] text-muted-foreground mt-1 font-bold uppercase tracking-wider">{t("homes.members_desc")}</p>
              </CardContent>
            </Card>

            <Card className="bg-green-500/5 border-green-500/20 shadow-none hover:shadow-md transition-all duration-300 border-2">
              <CardHeader className="pb-1.5">
                <CardTitle className="text-[10px] font-black uppercase tracking-widest flex items-center justify-between opacity-50">
                  {t('homes.upcoming_events')}
                  <Calendar className="h-3.5 w-3.5 text-green-500" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-black">0</div>
                <p className="text-[10px] text-muted-foreground mt-1 font-bold uppercase tracking-wider">{t("homes.no_events")}</p>
              </CardContent>
            </Card>

            <Card className="md:col-span-2 lg:col-span-3 border-none bg-muted/20">
              <CardHeader className="px-6 pt-6 text-center sm:text-left">
                <CardTitle className="text-xl font-bold tracking-tight">{t("homes.members_list")}</CardTitle>
                <CardDescription className="text-sm font-medium">{t("homes.members_list_desc")}</CardDescription>
              </CardHeader>
              <CardContent className="px-6 pb-6">
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {members.map((membership) => (
                    <div 
                      key={membership.id} 
                      className="flex items-center justify-between p-4 rounded-xl bg-background border shadow-sm hover:shadow-lg hover:border-primary/40 transition-all duration-300 group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center font-black text-primary border group-hover:scale-105 transition-transform">
                          {membership.user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="overflow-hidden">
                          <p className="font-bold flex items-center gap-1.5 truncate text-sm">
                            {membership.user.name}
                            {membership.user.id === user?.id && (
                              <Badge key="me" variant="secondary" className="text-[9px] h-4 uppercase font-black px-1.5 leading-none bg-primary/10 text-primary border-none">
                                {t('homes.badge_me')}
                              </Badge>
                            )}
                          </p>
                          <p className="text-[10px] text-muted-foreground font-medium flex items-center gap-1 truncate">
                            {membership.user.email}
                          </p>
                        </div>
                      </div>
                      <div className="shrink-0">
                        <Badge variant={membership.role === 'ORG_ADMIN' ? 'default' : 'outline'} className='rounded-md font-bold px-2 py-0.5 text-[10px]'>
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

      <div 
        className={`fixed z-[100] flex flex-col items-center group transition-all ${isDragging ? "" : "duration-500 ease-out"} ${isAllAppsOpen ? "opacity-0 scale-90 pointer-events-none" : "opacity-100 scale-100 visible"}`}
        style={{ left: pos.x, top: pos.y, touchAction: 'none' }}
      >
        <Button 
          variant="ghost"
          className={`h-14 w-14 p-0 rounded-full cursor-pointer transition-transform active:scale-95 border-2 border-white/20 shadow-2xl overflow-hidden hover:bg-background/60 relative`}
          onMouseDown={handleMouseDown}
          onTouchStart={handleMouseDown}
          onClick={() => !isDragging && setIsDockOpen(!isDockOpen)}
        >
          <div className="absolute inset-0 bg-background/60 shadow-inner" />
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <LayoutGrid className={`relative z-10 h-6 w-6 transition-transform duration-500 will-change-transform transform-gpu ease-[cubic-bezier(0.34,1.56,0.64,1)] ${isDockOpen ? "rotate-90 text-primary scale-110" : "text-muted-foreground"}`} />
          {!isDockOpen && !isAllAppsOpen && <div className="absolute inset-0 rounded-full border-2 border-primary/30 animate-ping opacity-20" />}
        </Button>
      </div>

      <div className={`fixed inset-x-0 bottom-6 z-[90] flex flex-col items-center gap-3 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${isDockOpen && !isAllAppsOpen ? "translate-y-0 opacity-100 visible scale-100" : "translate-y-32 opacity-0 invisible scale-95 pointer-events-none"}`}>
        <div className="bg-background/80 border border-white/20 rounded-[2.5rem] p-2.5 shadow-2xl relative w-[500px] max-w-[calc(100vw-48px)] flex flex-col items-center ring-1 ring-black/5 transform-gpu">
          {/* Subtle Expand Trigger Button (Center-Top) */}
          <Button 
            variant="ghost" 
            className="absolute -top-3 left-1/2 -translate-x-1/2 h-6 w-10 p-0 rounded-full bg-background border border-white/20 shadow-lg group-hover:scale-110 group-active:scale-95 transition-all duration-500 hover:bg-background/80 flex items-center justify-center z-20"
            onClick={() => setIsAllAppsOpen(true)}
          >
            <ChevronUp className="h-3 w-3 text-primary animate-bounce-slow" />
          </Button>

          <div className="w-full flex flex-col items-center overflow-hidden">
            <div ref={scrollRef} className="flex items-center w-full overflow-x-auto snap-x snap-mandatory no-scrollbar" onScroll={handleScroll}>
              {[...Array(totalPages)].map((_, pageIdx) => (
                <div key={pageIdx} className="flex-none w-full grid grid-cols-6 gap-2 px-1 snap-start">
                  {apps.slice(pageIdx * 6, (pageIdx + 1) * 6).map((app) => (
                    <DropdownMenu key={app.id}>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="ghost" 
                          className="h-auto flex flex-col items-center gap-1.5 p-1 group ring-offset-background transition-all hover:bg-transparent" 
                          onClick={() => {
                            setIsDockOpen(false);
                            navigate({ to: app.path as any });
                          }}
                        >
                          <div className={`h-14 w-14 rounded-2xl ${app.color} flex items-center justify-center text-white shadow-lg group-hover:scale-105 group-active:scale-95 transition-all duration-300 relative overflow-visible`}>
                            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
                            <app.icon className="h-6 w-6 shadow-sm" />
                            {app.badge > 0 && (
                              <div className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-black min-w-[18px] h-[18px] flex items-center justify-center rounded-full border-2 border-background shadow-lg px-1 animate-in zoom-in slide-in-from-bottom-1 blur-none">
                                {app.badge > 99 ? '99+' : app.badge}
                              </div>
                            )}
                          </div>
                          <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground group-hover:text-foreground transition-colors px-1 truncate w-full text-center">{app.label}</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent blur-md align="center" className="w-48 bg-background/80 backdrop-blur-md border-white/20">
                         <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest opacity-50">{app.label}</DropdownMenuLabel>
                         <DropdownMenuSeparator />
                         <DropdownMenuItem onClick={() => navigate({ to: app.path as any })}>
                            <div className="flex items-center gap-2">
                               <app.icon className="h-4 w-4" />
                               <span className="text-sm font-medium">Mở ứng dụng</span>
                            </div>
                         </DropdownMenuItem>
                         <DropdownMenuItem>
                            <span className="text-sm font-medium">Ghim vào thanh dock</span>
                         </DropdownMenuItem>
                         <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10">
                            <span className="text-sm font-medium">Gỡ ứng dụng</span>
                         </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ))}
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex gap-1.5 mt-2 pb-0.5">
                {[...Array(totalPages)].map((_, i) => (
                  <button 
                    key={i} 
                    onClick={() => scrollToPage(i)}
                    className={`h-1 rounded-full transition-all duration-300 cursor-pointer hover:bg-primary/50 relative group ${currentPage === i ? "bg-primary w-4" : "bg-muted-foreground/20 w-1"}`}
                  >
                    <span className="absolute -inset-2" title={`Page ${i + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* All Apps Launcher (Magnified DOCK only, no backdrop) */}
      <div className={`fixed inset-0 z-[110] ${isAllAppsOpen ? "visible" : "invisible pointer-events-none"}`}>
        {/* Transparent click-to-close area (No visual backdrop) */}
        <div 
          className="absolute inset-0"
          onClick={() => {
             setIsAllAppsOpen(false);
             setSearchQuery('');
          }}
        />
        
        {/* Perfect Launcher Zoom Expansion (Optimized for GPU) */}
        <div 
          className={`absolute inset-0 flex items-center justify-center p-4 transition-all duration-500 transform-gpu ease-[cubic-bezier(0.34,1.56,0.64,1)] will-change-transform origin-bottom ${isAllAppsOpen ? "scale-100 opacity-100 translate-y-0" : "scale-[0.7] opacity-0 translate-y-24"}`}
          style={{ pointerEvents: isAllAppsOpen ? "auto" : "none" }}
          onClick={() => {
             setIsAllAppsOpen(false);
             setSearchQuery('');
          }}
        >
          <div 
            className="bg-background/90 border border-white/10 rounded-[2.5rem] p-8 shadow-2xl relative w-full max-w-5xl h-[75vh] flex flex-col items-center ring-1 ring-black/5 transform-gpu backface-visibility-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute top-6 right-6 h-10 w-10 rounded-full bg-muted/20 hover:bg-muted/40 border transition-all hover:rotate-90 z-20"
              onClick={() => setIsAllAppsOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>

            {/* Search Header */}
            <div className="w-full max-w-xl mb-10 animate-reveal relative z-10">
              <h2 className="text-xl font-black tracking-widest text-center mb-6 uppercase opacity-40">{t('homes.all_apps')}</h2>
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input 
                  type="text" 
                  autoFocus={isAllAppsOpen}
                  placeholder={t('homes.search_apps')}
                  className="w-full h-14 pl-12 pr-4 bg-background border-2 border-white/10 rounded-2xl outline-none focus:border-primary/40 focus:bg-background/90 transition-all text-lg font-medium shadow-xl"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* App Grid inside the expanded DOCK */}
            <div className="w-full overflow-y-auto px-4 custom-scrollbar relative z-10">
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-x-4 gap-y-8 pb-4">
                {filteredApps.map((app) => (
                  <DropdownMenu key={app.id}>
                    <DropdownMenuTrigger asChild>
                      <button
                        className="flex flex-col items-center gap-2 group transition-all hover:scale-110 active:scale-95 outline-none"
                        onClick={() => {
                          setIsAllAppsOpen(false);
                          navigate({ to: app.path as any });
                        }}
                      >
                        <div className={`h-14 w-14 rounded-2xl ${app.color} flex items-center justify-center text-white shadow-xl relative overflow-visible ring-2 ring-white/10 group-hover:ring-primary/40 transition-all`}>
                          <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
                          <app.icon className="h-6 w-6 drop-shadow-lg" />
                          {app.badge > 0 && (
                            <div className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-black min-w-[20px] h-[20px] flex items-center justify-center rounded-full border-2 border-background shadow-lg px-1 animate-in zoom-in slide-in-from-bottom-1">
                              {app.badge > 99 ? '99+' : app.badge}
                            </div>
                          )}
                        </div>
                        <span className="text-[8px] font-bold uppercase tracking-wider text-muted-foreground group-hover:text-foreground transition-colors text-center w-full truncate px-1">
                          {app.label}
                        </span>
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent blur-md align="center" className="w-48 bg-background/80 backdrop-blur-md border-white/20">
                      <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest opacity-50">{app.label}</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => navigate({ to: app.path as any })}>
                        <div className="flex items-center gap-2">
                          <app.icon className="h-4 w-4" />
                          <span className="text-sm font-medium">Mở ứng dụng</span>
                        </div>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <span className="text-sm font-medium">Xem chi tiết</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ))}
              </div>
              {filteredApps.length === 0 && (
                <div className="py-20 text-center">
                  <p className="text-muted-foreground font-bold">{t('homes.no_apps_found')}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {isDockOpen && !isAllAppsOpen && (
        <div 
          className="fixed inset-0 z-[80]" 
          onClick={() => {
            setIsDockOpen(false);
            setIsAllAppsOpen(false);
            setSearchQuery('');
          }} 
        />
      )}
    </div>
  )
}
