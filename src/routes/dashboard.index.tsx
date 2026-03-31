import { useEffect } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useAuthStore } from '@/stores/auth-store'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, ShieldAlert } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/dashboard/')({
  component: DashboardPage,
})

function DashboardPage() {
  const { user, currentOrg } = useAuthStore()
  const navigate = useNavigate()

  useEffect(() => {
    if (currentOrg?.id) {
      navigate({ to: '/dashboard/homes/$orgId', params: { orgId: currentOrg.id } })
    }
  }, [currentOrg, navigate])

  return (
    <div className="space-y-8 animate-reveal">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Chào, {user?.name || 'bạn'}! 👋
        </h1>
        <p className="text-muted-foreground">
          Dưới đây là tổng quan về ngôi nhà {currentOrg?.name || 'My Homie'} của bạn.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Thành viên</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground">Chỉ mình bạn trong tổ ấm này</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Chào mừng đến với My Homie!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Tài khoản của bạn đã được khởi tạo thành công. Bây giờ bạn có thể bắt đầu quản lý chi phí gia đình, 
              lên lịch trình chung hoặc mời người thân tham gia.
            </p>
            <div className="flex gap-4">
              <Button onClick={() => navigate({ to: '/dashboard/settings/organization' })}>
                Mời người thân ngay
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Mẹo nhỏ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <ShieldAlert className="h-5 w-5 text-yellow-500 shrink-0" />
                <p className="text-xs leading-relaxed">
                  Hãy giữ mã mời gia đình của bạn bí mật. Chỉ những người có mã mới có thể truy cập dữ liệu tổ ấm.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
