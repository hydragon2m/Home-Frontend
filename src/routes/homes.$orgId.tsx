import { createFileRoute, useNavigate } from '@tanstack/react-router'
import * as React from 'react'
import { useState, useEffect } from 'react'
import { useAuthStore } from '@/stores/auth-store'
import api from '@/lib/axios'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, Calendar, Home as HomeIcon, Loader2, ArrowLeft, Settings } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { LanguageToggle } from '@/components/elements/LanguageToggle'
import { ModeToggle } from '@/components/elements/ModeToggle'

export const Route = createFileRoute('/homes/$orgId')({
  component: FamilyHomePage,
})

function FamilyHomePage() {
  const { orgId } = Route.useParams() as any
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [org, setOrg] = useState<any>(null)
  const [members, setMembers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    setLoading(true)
    try {
      const [orgRes, membersRes] = await Promise.all([
        api.get(`/organizations/${orgId}`),
        api.get(`/organizations/${orgId}/members`)
      ])
      setOrg(orgRes.data)
      setMembers(membersRes.data)
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
        <p className="text-muted-foreground animate-pulse font-medium tracking-tight">Đang tải dữ liệu tổ ấm...</p>
      </div>
    )
  }

  if (!org) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
        <h2 className="text-2xl font-bold">Không tìm thấy gia đình</h2>
        <p className="text-muted-foreground mt-2 max-w-md">Vui lòng kiểm tra lại đường dẫn hoặc quyền truy cập của bạn.</p>
        <Button variant="ghost" className="mt-6" onClick={() => navigate({ to: '/dashboard' })}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Quay lại Dashboard
        </Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Standalone Home Header */}
      <header className="h-16 border-b flex items-center justify-between px-6 bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-4">
           <Button variant="ghost" size="icon" onClick={() => navigate({ to: '/dashboard' })} title="Quay lại danh sách">
             <ArrowLeft className="h-5 w-5" />
           </Button>
           <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded bg-primary flex items-center justify-center text-primary-foreground font-bold">
                 {org.name.charAt(0)}
              </div>
              <h1 className="font-bold text-lg hidden sm:block">{org.name}</h1>
           </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2">
            <LanguageToggle />
            <ModeToggle />
          </div>
          <div className="h-4 w-px bg-border mx-1" />
          <Button variant="ghost" size="sm" onClick={() => navigate({ to: '/dashboard/profile' })}>
            {user?.name}
          </Button>
        </div>
      </header>

      <main className="flex-1 p-6 md:p-10">
        <div className="max-w-7xl mx-auto space-y-8 animate-reveal">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b pb-8">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-primary">
                <HomeIcon className="h-5 w-5" />
                <span className="text-sm font-semibold uppercase tracking-widest">Không gian của bạn</span>
              </div>
              <h1 className="text-5xl font-black tracking-tighter capitalize lg:text-6xl">
                {org.name}
              </h1>
              <p className="text-xl text-muted-foreground">
                Chào mừng bạn trở về nhà, <span className="font-semibold text-foreground">{user?.name}</span>.
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="h-11 px-6">
                <Settings className="mr-2 h-4 w-4" /> Cài đặt
              </Button>
              <Button className="h-11 px-8 shadow-lg shadow-primary/20">
                Mời người thân
              </Button>
            </div>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Stats Cards */}
            <Card className="bg-primary/5 border-primary/20 shadow-none hover:shadow-xl transition-all duration-300">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold uppercase tracking-widest flex items-center justify-between opacity-70">
                  Thành viên
                  <Users className="h-4 w-4" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-black">{members.length}</div>
                <p className="text-xs text-muted-foreground mt-2 font-medium">Đang cùng sinh hoạt trong tổ ấm</p>
              </CardContent>
            </Card>

            <Card className="bg-green-500/5 border-green-500/20 shadow-none hover:shadow-xl transition-all duration-300">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold uppercase tracking-widest flex items-center justify-between opacity-70">
                  Sự kiện sắp tới
                  <Calendar className="h-4 w-4" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-black">0</div>
                <p className="text-xs text-muted-foreground mt-2 font-medium">Chưa có lịch trình chung nào</p>
              </CardContent>
            </Card>

            {/* Members List Section */}
            <Card className="md:col-span-2 lg:col-span-3 border-none bg-muted/30">
              <CardHeader className="px-8 pt-8">
                <CardTitle className="text-2xl font-bold tracking-tight">Danh sách thành viên</CardTitle>
                <CardDescription className="text-base">Những người thân đang cùng bạn quản lý tổ ấm này.</CardDescription>
              </CardHeader>
              <CardContent className="px-8 pb-8">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {members.map((membership) => (
                    <div 
                      key={membership.id} 
                      className="flex items-center justify-between p-4 rounded-xl bg-background border shadow-sm hover:shadow-md transition-all duration-300 group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary border group-hover:scale-105 transition-transform">
                          {membership.user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="overflow-hidden">
                          <p className="font-bold flex items-center gap-2 truncate">
                            {membership.user.name}
                            {membership.user.id === user?.id && (
                              <Badge key="me" variant="secondary" className="text-[9px] h-4 uppercase font-black px-1.5 leading-none">
                                Bạn
                              </Badge>
                            )}
                          </p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1 truncate">
                            {membership.user.email}
                          </p>
                        </div>
                      </div>
                      <div className="shrink-0">
                        <Badge variant={membership.role === 'ORG_ADMIN' ? 'default' : 'outline'} className="rounded-md">
                          {membership.role === 'ORG_ADMIN' ? 'Chủ nhà' : 'Thành viên'}
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
