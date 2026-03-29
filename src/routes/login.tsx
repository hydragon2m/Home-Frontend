import { createFileRoute, Link } from '@tanstack/react-router'
import { MainLayout } from '@/layouts/MainLayout'
import { Button } from '@/components/ui/button'
import { useTranslation } from 'react-i18next'

export const Route = createFileRoute('/login')({
  component: LoginPage,
})

function LoginPage() {
  const { t } = useTranslation()

  return (
    <MainLayout>
      <div className="container flex flex-col items-center justify-center min-h-[60vh] py-12 text-center">
        <h1 className="text-3xl font-bold mb-4">{t('common.login')}</h1>
        <p className="text-muted-foreground mb-8 text-lg">
          Trang đăng nhập đang được phát triển...
        </p>
        <Button asChild>
          <Link to="/">Quay lại trang chủ</Link>
        </Button>
      </div>
    </MainLayout>
  )
}
