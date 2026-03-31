import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { useAuthStore } from '@/stores/auth-store'
import api from '@/lib/axios'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, Shield, Mail, Calendar, Home as HomeIcon, Loader2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/dashboard/homes/$orgId')({
  component: FamilyHomePage,
})

function FamilyHomePage() {
  const { orgId } = Route.useParams() as any
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
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground animate-pulse">Đang tải dữ liệu tổ ấm...</p>
      </div>
    )
  }

  if (!org) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold">Không tìm thấy gia đình</h2>
        <p className="text-muted-foreground">Vui lòng kiểm tra lại đường dẫn hoặc quyền truy cập.</p>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-reveal">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-primary">
            <HomeIcon className="h-5 w-5" />
            <span className="text-sm font-semibold uppercase tracking-wider">Tổ ấm của bạn</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight capitalize">
            {org.name}
          </h1>
          <p className="text-muted-foreground">
            Chào mừng bạn trở về nhà, <span className="font-medium text-foreground">{user?.name}</span>.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">Cài đặt</Button>
          <Button size="sm">Mời người thân</Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Stats Cards */}
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center justify-between">
              Thành viên
              <Users className="h-4 w-4 text-primary" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{members.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Đang cùng sinh hoạt trong tổ ấm</p>
          </CardContent>
        </Card>

        <Card className="bg-green-500/5 border-green-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center justify-between">
              Sự kiện sắp tới
              <Calendar className="h-4 w-4 text-green-600" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">0</div>
            <p className="text-xs text-muted-foreground mt-1">Chưa có lịch trình chung nào</p>
          </CardContent>
        </Card>

        {/* Members List Section */}
        <Card className="md:col-span-2 lg:col-span-3">
          <CardHeader>
            <CardTitle>Danh sách thành viên</CardTitle>
            <CardDescription>Những người thân đang cùng bạn quản lý tổ ấm này.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {members.map((membership) => (
                <div 
                  key={membership.id} 
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors border border-transparent hover:border-border"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary border">
                      {membership.user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium flex items-center gap-2">
                        {membership.user.name}
                        {membership.user.id === user?.id && (
                          <Badge variant="secondary" className="text-[10px] h-4">Bạn</Badge>
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {membership.user.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={membership.role === 'ORG_ADMIN' ? 'default' : 'outline'} className="gap-1">
                      {membership.role === 'ORG_ADMIN' ? (
                        <>
                          <Shield className="h-3 w-3" />
                          Chủ nhà
                        </>
                      ) : (
                        'Thành viên'
                      )}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
