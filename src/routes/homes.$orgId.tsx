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
    { id: 'dashboard', icon: LayoutGrid, label: t('org.context_global'), color: 'bg-blue-500' },
    { id: 'members', icon: Users, label: t('homes.members_title'), color: 'bg-green-500' },
    { id: 'finance', icon: Wallet, label: t('common.features.finance.title'), color: 'bg-orange-500' },
    { id: 'calendar', icon: Calendar, label: t('common.features.calendar.title'), color: 'bg-purple-500' },
    { id: 'tasks', icon: CheckSquare, label: t('common.features.todo.title'), color: 'bg-pink-500' },
    { id: 'settings', icon: Settings, label: t('homes.settings'), color: 'bg-gray-500' },
    { id: 'devices', icon: Layout, label: t('common.features.devices.title') || 'Thiết bị', color: 'bg-cyan-500' },
    { id: 'music', icon: Music, label: 'Nhạc', color: 'bg-rose-500' },
    { id: 'camera', icon: Camera, label: 'Ảnh', color: 'bg-orange-400' },
    { id: 'folder', icon: Folder, label: 'Tệp', color: 'bg-blue-400' },
    { id: 'phone', icon: Phone, label: 'Gọi điện', color: 'bg-emerald-500' },
    { id: 'mail', icon: Mail, label: 'Email', color: 'bg-sky-500' },
    { id: 'message', icon: MessageSquare, label: 'Tin nhắn', color: 'bg-green-400' },
    { id: 'health', icon: Heart, label: 'Sức khỏe', color: 'bg-red-500' },
    { id: 'security', icon: Shield, label: 'Bảo mật', color: 'bg-indigo-600' },
    { id: 'shop', icon: ShoppingBag, label: 'Cửa hàng', color: 'bg-amber-500' },
    { id: 'energy', icon: Zap, label: 'Điện năng', color: 'bg-yellow-400' },
    { id: 'games', icon: Gamepad2, label: 'Trò chơi', color: 'bg-purple-400' },
    { id: 'cloud', icon: Cloud, label: 'Lưu trữ', color: 'bg-blue-300' },
    { id: 'video', icon: Video, label: 'Video', color: 'bg-red-400' },
    { id: 'map', icon: Map, label: 'Bản đồ', color: 'bg-emerald-400' },
    { id: 'mic', icon: Mic, label: 'Ghi âm', color: 'bg-orange-600' },
    { id: 'lang', icon: Languages, label: 'Ngôn ngữ', color: 'bg-teal-500' },
    { id: 'activity', icon: Activity, label: 'Hoạt động', color: 'bg-fuchsia-500' },
    { id: 'package', icon: Package, label: 'Kiện hàng', color: 'bg-amber-600' },
    { id: 'coffee', icon: Coffee, label: 'Cà phê', color: 'bg-amber-800' },
    { id: 'car', icon: Car, label: 'Xe cộ', color: 'bg-slate-700' },
    { id: 'plane', icon: Plane, label: 'Du lịch', color: 'bg-sky-400' },
    { id: 'target', icon: Target, label: 'Mục tiêu', color: 'bg-rose-600' },
    { id: 'star', icon: Star, label: 'Yêu thích', color: 'bg-yellow-500' },
    { id: 'paint', icon: Palette, label: 'Chủ đề', color: 'bg-indigo-400' },
    { id: 'search', icon: Search, label: 'Tìm kiếm', color: 'bg-gray-400' },
    { id: 'cart', icon: ShoppingCart, label: 'Giỏ hàng', color: 'bg-orange-500' },
    { id: 'wind', icon: Wind, label: 'Thời tiết', color: 'bg-blue-200' },
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
              <Button variant="outline" className="h-10 px-4 font-bold rounded-lg border-2">
                <Settings className="mr-2 h-3.5 w-3.5" /> {t("homes.settings")}
              </Button>
              <Button className="h-10 px-6 font-black rounded-lg shadow-lg shadow-primary/20 bg-primary hover:scale-[1.02] transition-transform">
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
        className={`fixed z-[100] flex flex-col items-center group transition-transform ${isDragging ? "" : "duration-500 ease-out"}`}
        style={{ left: pos.x, top: pos.y, touchAction: 'none' }}
      >
        <Button 
          variant="ghost"
          className={`h-14 w-14 p-0 rounded-full cursor-pointer transition-transform active:scale-95 border-2 border-white/20 shadow-2xl overflow-hidden hover:bg-background/60 relative`}
          onMouseDown={handleMouseDown}
          onTouchStart={handleMouseDown}
          onClick={() => !isDragging && setIsDockOpen(!isDockOpen)}
        >
          <div className="absolute inset-0 bg-background/40 backdrop-blur-xl" />
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <LayoutGrid className={`relative z-10 h-6 w-6 transition-transform duration-500 will-change-transform transform-gpu ease-[cubic-bezier(0.34,1.56,0.64,1)] ${isDockOpen ? "rotate-90 text-primary scale-110" : "text-muted-foreground"}`} />
          {!isDockOpen && !isAllAppsOpen && <div className="absolute inset-0 rounded-full border-2 border-primary/30 animate-ping opacity-20" />}
        </Button>
      </div>

      <div className={`fixed inset-x-0 bottom-6 z-[90] flex flex-col items-center gap-3 transition-all duration-500 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] ${isDockOpen ? "translate-y-0 opacity-100" : "translate-y-32 opacity-0 pointer-events-none"}`}>
        <div className="bg-background/40 backdrop-blur-2xl border border-white/20 rounded-[2.5rem] p-2.5 shadow-2xl relative w-[540px] max-w-[calc(100vw-48px)] flex items-center ring-1 ring-black/5">
          {/* Fixed "Tất cả" Button */}
          <div className="shrink-0 pr-2 mr-2 border-r border-white/10">
            <Button 
              variant="ghost" 
              className="h-auto flex flex-col items-center gap-1.5 p-1 group ring-offset-background transition-all hover:bg-transparent" 
              onClick={() => setIsAllAppsOpen(true)}
            >
              <div className="h-14 w-14 rounded-2xl bg-primary/10 border-2 border-primary/20 flex items-center justify-center text-primary shadow-lg group-hover:scale-105 group-active:scale-95 transition-all duration-300 relative overflow-hidden backdrop-blur-md">
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                <ChevronUp className="h-5 w-5 animate-bounce-slow" />
              </div>
              <span className="text-[7px] font-black uppercase tracking-widest text-primary/60 group-hover:text-primary transition-colors px-1 truncate w-full text-center">Mở rộng</span>
            </Button>
          </div>

          <div className="flex-1 flex flex-col items-center overflow-hidden">
            <div ref={scrollRef} className="flex items-center w-full overflow-x-auto snap-x snap-mandatory no-scrollbar" onScroll={handleScroll}>
              {[...Array(totalPages)].map((_, pageIdx) => (
                <div key={pageIdx} className="flex-none w-full grid grid-cols-6 gap-2 px-1 snap-start">
                  {apps.slice(pageIdx * 6, (pageIdx + 1) * 6).map((app) => (
                    <Button key={app.id} variant="ghost" className="h-auto flex flex-col items-center gap-1.5 p-1 group ring-offset-background transition-all hover:bg-transparent" onClick={() => setIsDockOpen(false)}>
                      <div className={`h-14 w-14 rounded-2xl ${app.color} flex items-center justify-center text-white shadow-lg group-hover:scale-105 group-active:scale-95 transition-all duration-300 relative overflow-hidden`}>
                        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <app.icon className="h-6 w-6 shadow-sm" />
                      </div>
                      <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground group-hover:text-foreground transition-colors px-1 truncate w-full text-center">{app.label}</span>
                    </Button>
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

      {/* All Apps Launcher Overlay (Magnified DOCK style) */}
      <div className={`fixed inset-0 z-[110] transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${isAllAppsOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"}`}>
        <div className="absolute inset-0 bg-black/10 backdrop-blur-sm" onClick={() => {
           setIsAllAppsOpen(false);
           setSearchQuery('');
        }} />
        
        <div className={`absolute inset-0 flex items-center justify-center p-4 transition-all duration-500 transform-gpu ease-[cubic-bezier(0.34,1.56,0.64,1)] will-change-transform ${isAllAppsOpen ? "scale-100 opacity-100 translate-y-0" : "scale-75 opacity-0 translate-y-20"}`}>
          <div className="bg-background/40 backdrop-blur-2xl border border-white/20 rounded-[3rem] p-8 shadow-2xl relative w-full max-w-4xl max-h-[85vh] overflow-hidden flex flex-col items-center ring-1 ring-black/5 transform-gpu backface-visibility-hidden">
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
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input 
                  type="text" 
                  autoFocus={isAllAppsOpen}
                  placeholder={t('homes.search_apps') || 'Tìm kiếm nhanh...'}
                  className="w-full h-14 pl-12 pr-4 bg-background/20 border-2 border-white/10 rounded-2xl outline-none focus:border-primary/40 focus:bg-background/40 transition-all text-lg font-medium shadow-xl backdrop-blur-md"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* App Grid inside the expanded DOCK */}
            <div className="w-full overflow-y-auto px-4 custom-scrollbar relative z-10">
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-6 md:gap-10 pb-4">
                {filteredApps.map((app, idx) => (
                  <button
                    key={app.id}
                    className="flex flex-col items-center gap-3 group animate-reveal transition-transform hover:scale-105 active:scale-95"
                    style={{ animationDelay: `${idx * 20}ms` }}
                    onClick={() => {
                      setIsAllAppsOpen(false);
                      // Handle app click...
                    }}
                  >
                    <div className={`h-20 w-20 md:h-24 md:w-24 rounded-[2rem] ${app.color} flex items-center justify-center text-white shadow-2xl relative overflow-hidden ring-4 ring-white/10`}>
                      <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <app.icon className="h-10 w-10 md:h-12 md:w-12 drop-shadow-xl" />
                    </div>
                    <span className="text-[10px] md:text-xs font-black uppercase tracking-widest text-muted-foreground group-hover:text-foreground transition-colors text-center w-full truncate">
                      {app.label}
                    </span>
                  </button>
                ))}
              </div>
              {filteredApps.length === 0 && (
                <div className="py-20 text-center">
                  <p className="text-muted-foreground font-bold">{t('homes.no_apps_found') || 'Không có ứng dụng này'}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {isDockOpen && !isAllAppsOpen && <div className="fixed inset-0 z-[80] bg-black/5 backdrop-blur-[2px]" onClick={() => setIsDockOpen(false)} />}
    </div>
  )
}
