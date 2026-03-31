import { useState, useEffect } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useAuthStore } from '@/stores/auth-store'
import api from '@/lib/axios'
import { 
  Users, 
  Plus, 
  ArrowRight, 
  Loader2, 
  Home,
  LayoutGrid,
  Settings2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useTranslation } from 'react-i18next'

export const Route = createFileRoute('/dashboard/')({
  component: DashboardPage
})

function DashboardPage() {
  const { t } = useTranslation()
  const { user, setOrg } = useAuthStore()
  const navigate = useNavigate()
  const [orgs, setOrgs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchOrgs = async () => {
    setLoading(true)
    try {
      const res: any = await api.get('/organizations/me')
      setOrgs(res.data || [])
    } catch (err) {
      console.error('Failed to fetch organizations', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrgs()
  }, [])

  const handleEnterHome = async (org: any) => {
    try {
      // Get the role for this specific org if needed via swap-token, 
      // but if we already have it in the list, we can just set it.
      // Usually swap-token is safer to get the correct permissions.
      const res: any = await api.post('/auth/swap-token', { orgId: org.id })
      setOrg({
        id: org.id,
        name: org.name,
        role: res.data.role
      })
      navigate({ to: '/homes/$orgId', params: { orgId: org.id } })
    } catch (err) {
      console.error('Failed to enter home', err)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-muted-foreground animate-pulse font-medium tracking-tight">Đang chuẩn bị tổ ấm cho bạn...</p>
      </div>
    )
  }

  return (
    <div className="space-y-10 animate-reveal pb-20">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-4xl font-black tracking-tight lg:text-5xl">
            {t('dashboard.welcome', { name: user?.name })} 👋
          </h1>
          <p className="text-xl text-muted-foreground font-medium">
            Bạn muốn ghé thăm tổ ấm nào hôm nay?
          </p>
        </div>
        <div className="flex gap-2 bg-muted p-1 rounded-lg">
           <Button variant="ghost" size="sm" className="bg-background shadow-sm h-8 px-4">
             <LayoutGrid className="mr-2 h-4 w-4" /> Dạng lưới
           </Button>
           <Button variant="ghost" size="sm" className="h-8 px-4 text-muted-foreground opacity-50">
             <Settings2 className="mr-2 h-4 w-4" /> Quản lý chung
           </Button>
        </div>
      </div>

      {/* Families Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {/* Create Card */}
        <Card 
          className="border-2 border-dashed border-primary/20 bg-primary/5 hover:border-primary/50 hover:bg-primary/10 transition-all duration-300 cursor-pointer group relative overflow-hidden"
          onClick={() => navigate({ to: '/dashboard/settings/organization' })}
        >
          <div className="absolute inset-0 flex flex-col items-center justify-center space-y-3 p-8">
            <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground group-hover:scale-110 transition-transform shadow-lg shadow-primary/20">
              <Plus className="h-6 w-6" />
            </div>
            <div className="text-center">
              <h3 className="font-bold text-lg">{t('org.create_new')}</h3>
              <p className="text-xs text-muted-foreground mt-1 px-4">Bắt đầu xây dựng một không gian gia đình mới</p>
            </div>
          </div>
          <div className="h-64" /> {/* Spacer for aspect ratio */}
        </Card>

        {/* Existing Families */}
        {orgs.map((org: any) => (
          <Card 
            key={org.id} 
            className="group hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden border-none shadow-sm ring-1 ring-border"
          >
            <div className="h-32 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent relative group-hover:from-primary/20 transition-colors">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-16 w-16 rounded-2xl bg-background border-4 border-muted shadow-xl flex items-center justify-center font-black text-2xl text-primary group-hover:rotate-6 transition-transform">
                  {org.name.charAt(0).toUpperCase()}
                </div>
              </div>
              <div className="absolute top-4 right-4">
                <Badge className="bg-background/80 backdrop-blur-sm text-foreground hover:bg-background border-none shadow-sm" variant="outline">
                   <div className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {t('org.role_admin')}
                   </div>
                </Badge>
              </div>
            </div>
            
            <CardHeader className="text-center pt-8 pb-4">
              <CardTitle className="text-xl font-bold tracking-tight">{org.name}</CardTitle>
              <CardDescription className="flex items-center justify-center gap-2">
                <Home className="h-3 w-3" />
                ID: {org.id.slice(0, 8)}...
              </CardDescription>
            </CardHeader>

            <CardContent className="px-6 py-4">
               <div className="flex justify-center gap-6 text-sm">
                  <div className="text-center">
                    <p className="font-bold">--</p>
                    <p className="text-[10px] text-muted-foreground uppercase font-black">Chi phí</p>
                  </div>
                  <div className="w-px h-8 bg-border" />
                  <div className="text-center">
                    <p className="font-bold">--</p>
                    <p className="text-[10px] text-muted-foreground uppercase font-black">Nhiệm vụ</p>
                  </div>
               </div>
            </CardContent>
            
            <CardFooter className="px-4 pb-4 pt-2">
              <Button 
                className="w-full h-11 bg-primary text-primary-foreground font-bold rounded-xl group-hover:shadow-lg group-hover:shadow-primary/30 transition-all opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0"
                onClick={() => handleEnterHome(org)}
              >
                {t('common.enter')} <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button 
                variant="secondary"
                className="w-full h-11 font-bold rounded-xl absolute inset-x-4 bottom-4 pointer-events-none group-hover:opacity-0 transition-opacity"
              >
                {t('common.enter')}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
