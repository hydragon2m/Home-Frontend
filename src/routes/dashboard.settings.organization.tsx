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
      const res = await api.post(`/organizations/${currentOrg.id}/invites`, {
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        maxUses: 5,
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
        <Card className={!isAdmin ? "opacity-50 pointer-events-none" : ""}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-primary" />
              Mời thành viên mới
            </CardTitle>
            <CardDescription>
              {isAdmin 
                ? "Tạo mã mời để thêm người thân vào gia đình của bạn." 
                : "Chỉ chủ nhà mới có quyền tạo mã mời."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {inviteCode ? (
              <div className="space-y-4">
                <div className="flex items-center gap-4 bg-muted p-4 rounded-lg border-2 border-dashed border-primary/30">
                  <span className="text-2xl font-mono font-bold tracking-widest text-primary flex-1 text-center">
                    {inviteCode}
                  </span>
                  <Button size="icon" variant="ghost" onClick={copyToClipboard}>
                    {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
                <p className="text-xs text-center text-muted-foreground">
                  Mã này có hiệu lực trong 7 ngày và dùng được cho 5 người.
                </p>
                <Button variant="outline" className="w-full" onClick={() => setInviteCode(null)}>
                  Tạo mã mới
                </Button>
              </div>
            ) : (
              <Button className="w-full h-24 text-lg border-2 border-dashed" variant="outline" onClick={generateInvite} disabled={loading}>
                {loading ? 'Đang tạo...' : 'Nhấn để tạo mã mời'}
              </Button>
            )}
          </CardContent>
        </Card>

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
