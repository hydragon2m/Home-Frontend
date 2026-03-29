import { Button } from '@/components/ui/button'
import { useTranslation } from 'react-i18next'
import { Link } from '@tanstack/react-router'

export function HeroSection() {
  const { t } = useTranslation()

  return (
    <section className="relative overflow-hidden pt-20 pb-24 lg:pt-32 lg:pb-40">
      {/* Decorative Blobs */}
      <div className="bg-blob top-[-10%] left-[-10%] opacity-50 dark:opacity-20" />
      <div className="bg-blob bottom-[-10%] right-[-10%] opacity-50 dark:opacity-20" />

      <div className="container px-4 mx-auto relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-8 animate-reveal">
            {t('common.welcome_prefix')}{' '}
            <span className="text-primary whitespace-nowrap">My Homie</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto animate-reveal animate-delay-100">
            {t('common.heroDescription')}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-reveal animate-delay-200">
            <Button size="lg" className="px-8 h-12 text-base font-semibold transition-all hover:scale-105" asChild>
              <Link to="/register">{t('common.getStarted')}</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
