import { createFileRoute, useNavigate, redirect } from '@tanstack/react-router'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import api from '@/lib/axios'
import { useAuthStore } from '@/stores/auth-store'
import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { AuthLayout } from '@/components/auth/AuthLayout'
import { useTranslation } from 'react-i18next'

const registerSchema = z.object({
  name: z.string().min(1, 'auth.validation.name_required'),
  email: z.string().min(1, 'auth.validation.email_required').email('auth.validation.email_invalid'),
  password: z.string().min(1, 'auth.validation.password_required').min(6, 'auth.validation.password_min'),
  confirmPassword: z.string().min(1, 'auth.validation.confirm_password_required'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "auth.validation.password_mismatch",
  path: ["confirmPassword"],
})

type RegisterFormValues = z.infer<typeof registerSchema>

export const Route = createFileRoute('/register')({
  beforeLoad: () => {
    if (useAuthStore.getState().isAuthenticated) {
      throw redirect({ to: '/dashboard' })
    }
  },
  component: RegisterPage,
})

function RegisterPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const setAuth = useAuthStore((state) => state.setAuth)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
    mode: 'onTouched',
  })

  const onSubmit = async (formData: RegisterFormValues) => {
    setLoading(true)
    setError(null)
    try {
      const { name, email, password } = formData
      // 1. Đăng ký tài khoản
      await api.post('/auth/register', { name, email, password })
      
      // 2. Tự động đăng nhập sau khi đăng ký thành công
      const loginRes: any = await api.post('/auth/login', { email, password })
      
      if (loginRes.data?.user) {
        setAuth(loginRes.data.user, null)
        navigate({ to: '/dashboard' })
      } else {
        // Fallback: Nếu login không trả user, gọi /me
        const profileRes: any = await api.get('/users/me')
        setAuth(profileRes.data, profileRes.data.orgId || null)
        navigate({ to: '/dashboard' })
      }
    } catch (err: any) {
      setError(err.response?.data?.message || t('auth.validation.register_failed'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout 
      title={t('auth.register_title')} 
      description={t('auth.register_description')}
    >
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {error && (
          <div className="p-3 text-sm font-medium text-destructive bg-destructive/10 rounded-md">
            {error}
          </div>
        )}
        
        <div className="space-y-2">
          <Label htmlFor="name">{t('auth.name')}</Label>
          <Input
            id="name"
            placeholder={t('auth.name_placeholder')}
            {...form.register('name')}
          />
          {form.formState.errors.name && (form.watch('name') || form.formState.isSubmitted) && (
            <p className="text-xs text-destructive">{t(form.formState.errors.name.message as string)}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">{t('auth.email')}</Label>
          <Input
            id="email"
            type="email"
            placeholder="name@example.com"
            {...form.register('email')}
          />
          {form.formState.errors.email && (form.watch('email') || form.formState.isSubmitted) && (
            <p className="text-xs text-destructive">{t(form.formState.errors.email.message as string)}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">{t('auth.password')}</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              className="pr-10"
              {...form.register('password')}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {form.formState.errors.password && (form.watch('password') || form.formState.isSubmitted) && (
            <p className="text-xs text-destructive">{t(form.formState.errors.password.message as string)}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">{t('auth.confirm_password')}</Label>
          <Input
            id="confirmPassword"
            type={showPassword ? 'text' : 'password'}
            {...form.register('confirmPassword')}
          />
          {form.formState.errors.confirmPassword && (form.watch('confirmPassword') || form.formState.isSubmitted) && (
            <p className="text-xs text-destructive">{t(form.formState.errors.confirmPassword.message as string)}</p>
          )}
        </div>

        <Button type="submit" className="w-full mt-2" disabled={loading}>
          {loading ? t('auth.creating_account') : t('auth.register_title')}
        </Button>

        <div className="pt-4 text-sm text-center text-muted-foreground">
          {t('auth.already_have_account')}{' '}
          <Button 
            variant="link" 
            className="p-0 h-auto font-semibold" 
            onClick={() => navigate({ to: '/login' })}
          >
            {t('auth.login_now')}
          </Button>
        </div>
      </form>
    </AuthLayout>
  )
}
