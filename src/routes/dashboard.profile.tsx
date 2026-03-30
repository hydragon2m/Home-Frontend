import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { useAuthStore } from '@/stores/auth-store'
import api from '@/lib/axios'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { User, Mail, Phone, FileText, Camera } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

const profileSchema = z.object({
  name: z.string().min(1, 'Vui lòng nhập họ tên'),
  phoneNumber: z.string().optional(),
  bio: z.string().optional(),
  avatar: z.string().url('URL không hợp lệ').optional().or(z.literal('')),
})

type ProfileFormValues = z.infer<typeof profileSchema>

export const Route = createFileRoute('/dashboard/profile')({
  component: ProfilePage,
})

function ProfilePage() {
  const { user, setAuth, currentOrg } = useAuthStore()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      phoneNumber: user?.phoneNumber || '',
      bio: user?.bio || '',
      avatar: user?.avatar || '',
    },
    mode: 'onTouched',
  })

  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name || '',
        phoneNumber: user.phoneNumber || '',
        bio: user.bio || '',
        avatar: user.avatar || '',
      })
    }
  }, [user, form])

  const onSubmit = async (formData: ProfileFormValues) => {
    setLoading(true)
    setMessage(null)
    try {
      // res is { message, data } thanks to axios interceptor
      const res: any = await api.patch('/users/me', formData)
      if (res.data) {
        setAuth(res.data, currentOrg)
      }
      setMessage({ type: 'success', text: res.message || 'Cập nhật hồ sơ thành công!' })
    } catch (err: any) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Có lỗi xảy ra khi cập nhật.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto py-6 px-4 sm:px-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Hồ sơ cá nhân</h2>
        <p className="text-muted-foreground">
          Quản lý thông tin cá nhân và cài đặt.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Thông tin cơ bản</CardTitle>
          <CardDescription>
            Cập nhật tên, ảnh đại diện và thông tin liên hệ của bạn.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            
            {message && (
              <div className={`p-3 text-sm font-medium rounded-md ${
                message.type === 'success' ? 'bg-green-500/10 text-green-600' : 'bg-destructive/10 text-destructive'
              }`}>
                {message.text}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-8 items-start">
              {/* Avatar Preview */}
              <div className="flex flex-col items-center gap-3 w-full sm:w-1/3">
                <div className="h-40 w-40 rounded-full border-4 border-background shadow-sm overflow-hidden bg-muted flex items-center justify-center relative group">
                  {form.watch('avatar') ? (
                    <img src={form.watch('avatar')} alt="Avatar" className="h-full w-full object-cover" />
                  ) : (
                    <User className="h-16 w-16 text-muted-foreground" />
                  )}
                </div>
                <div className="text-center space-y-1">
                  <p className="text-sm font-medium">Ảnh đại diện</p>
                  <p className="text-xs text-muted-foreground leading-tight">Hỗ trợ URL hình ảnh hợp lệ. Khuyên dùng hình vuông.</p>
                </div>
              </div>

              <div className="flex-1 space-y-4 w-full">
                <div className="space-y-2">
                  <Label htmlFor="avatar">URL Ảnh đại diện</Label>
                  <div className="relative">
                    <Camera className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="avatar" 
                      placeholder="https://example.com/avatar.jpg" 
                      className="pl-9"
                      {...form.register('avatar')} 
                    />
                  </div>
                  {form.formState.errors.avatar && (form.watch('avatar') || form.formState.isSubmitted) && (
                    <p className="text-xs text-destructive">{form.formState.errors.avatar.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email (Không thể thay đổi)</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="email" value={user?.email || ''} disabled className="pl-9 bg-muted" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">Họ và tên</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="name" placeholder="Nguyễn Văn A" className="pl-9" {...form.register('name')} />
                  </div>
                  {form.formState.errors.name && (form.watch('name') || form.formState.isSubmitted) && (
                    <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Số điện thoại</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="phoneNumber" placeholder="0901234567" className="pl-9" {...form.register('phoneNumber')} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Giới thiệu ngắn (Bio)</Label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Textarea 
                      id="bio" 
                      placeholder="Một vài điều về bản thân bạn..." 
                      className="min-h-[100px] pl-9" 
                      {...form.register('bio')} 
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-border mt-6">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  if (user) {
                    form.reset({
                      name: user.name || '',
                      phoneNumber: user.phoneNumber || '',
                      bio: user.bio || '',
                      avatar: user.avatar || '',
                    })
                  }
                  setMessage(null)
                }}
                disabled={loading}
              >
                Hủy thay đổi
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
