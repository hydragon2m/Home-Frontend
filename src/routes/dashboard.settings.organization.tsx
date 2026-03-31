import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { useAuthStore } from '@/stores/auth-store'
import api from '@/lib/axios'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, UserPlus, Link as LinkIcon, Shield, Copy, Check } from 'lucide-react'

export const Route = createFileRoute('/dashboard/settings/organization')({
  component: OrganizationSettingsPage,
})

function OrganizationSettingsPage() {
  const { currentOrg } = useAuthStore()
  const [inviteCode, setInviteCode] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [joinCode, setJoinCode] = useState('')
  const [joinLoading, setJoinLoading] = useState(false)

  const isAdmin = currentOrg?.role === 'ORG_ADMIN'

  const generateInvite = async () => {
    if (!currentOrg) return
    setLoading(true)
    try {
      const res: any = await api.post(`/organizations/${currentOrg.id}/invites`, {
        expiresInDays: 7,
        maxUses: 5,
        role: 'ORG_MEMBER'
      })
      setInviteCode(res.data.code)
    } catch (err) {
      alert('Không thể tạo mã mời. Vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = () => {
    if (inviteCode) {
      navigator.clipboard.writeText(inviteCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!joinCode) return
    setJoinLoading(true)
    try {
      await api.post(`/organizations/join/${joinCode}`)
      alert('Tham gia gia đình thành công!')
      window.location.reload() // Or update store and navigate
    } catch (err) {
      alert('Mã không hợp lệ hoặc đã hết hạn.')
    } finally {
      setJoinLoading(false)
    }
  }

  return (
    <div className="space-y-8 animate-reveal">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Quản lý Gia đình</h1>
        <p className="text-muted-foreground">
          Quản lý thành viên, lời mời và thông tin chung của tổ ấm.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Organization Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Thông tin chung
            </CardTitle>
            <CardDescription>Chi tiết về tổ chức hiện tại của bạn.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-1">
              <Label className="text-xs text-muted-foreground uppercase">Tên gia đình</Label>
              <p className="font-medium text-lg">{currentOrg?.name || 'Gia đình mặc định'}</p>
            </div>
            <div className="grid gap-1">
              <Label className="text-xs text-muted-foreground uppercase">Vai trò của bạn</Label>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary" />
                <p className="font-medium">{currentOrg?.role === 'ORG_ADMIN' ? 'Chủ nhà (Admin)' : 'Thành viên'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Invitation Section */}
        {/* Join Section */}
        <Card className="md:col-span-2 border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LinkIcon className="h-5 w-5 text-primary" />
              Tham gia gia đình khác
            </CardTitle>
            <CardDescription>Sử dụng mã mời 8 ký tự được chia sẻ từ người thân.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleJoin} className="flex gap-4">
              <Input 
                placeholder="Nhập mã mời (Vd: AB12CD34)" 
                className="font-mono text-center tracking-widest uppercase"
                maxLength={8}
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value)}
              />
              <Button type="submit" disabled={joinLoading || !joinCode}>
                {joinLoading ? 'Đang tham gia...' : 'Tham gia'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
