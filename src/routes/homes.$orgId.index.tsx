import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { useAuthStore } from '@/stores/auth-store'
import api from '@/lib/axios'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Users, 
  Calendar, 
  Loader2, 
  Settings,
  Layout
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useTranslation } from 'react-i18next'

export const Route = createFileRoute('/homes/$orgId/')({
  component: FamilyHomeDashboard,
})

function FamilyHomeDashboard() {
  const { t } = useTranslation()
  const { orgId } = Route.useParams() as any
  const navigate = useNavigate()
  const { user, currentOrg, setOrg } = useAuthStore()
  const [org, setOrgData] = useState<any>(null)
  const [members, setMembers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

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
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground animate-pulse font-medium tracking-tight">{t("homes.loading")}</p>
      </div>
    )
  }

  if (!org) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <h2 className="text-2xl font-bold">{t("homes.not_found")}</h2>
        <p className="text-muted-foreground mt-2 max-w-md">{t("homes.not_found_desc")}</p>
        <Button variant="ghost" className="mt-6" onClick={() => (window.location.href = "/dashboard")}>
          {t('homes.back_to_dashboard')}
        </Button>
      </div>
    )
  }

  return (
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
              <p className="text-sm font-medium text-muted-foreground">{t("homes.members_list_desc")}</p>
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
  )
}
