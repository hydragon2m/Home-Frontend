import { Button } from '@/components/ui/button'
import { useTranslation } from 'react-i18next'

export function HeroSection() {
  const { t } = useTranslation()

  return (
    <div className="container py-24 lg:py-32">
      <div className="flex flex-col items-center text-center space-y-8">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl whitespace-pre-line">
          {t('common.welcome')}
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl">
          {t('common.heroDescription')}
        </p>
        <div className="flex gap-4">
          <Button size="lg">{t('common.getStarted')}</Button>
          <Button size="lg" variant="outline">{t('common.documentation')}</Button>
        </div>
      </div>
    </div>
  )
}
