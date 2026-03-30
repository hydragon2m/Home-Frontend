import { createFileRoute } from '@tanstack/react-router'
import { MainLayout } from '@/layouts/MainLayout'
import { Logo } from '@/components/elements/Logo'
import { Users, Heart, Shield } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export const Route = createFileRoute('/about')({
  component: AboutPage,
})

function AboutPage() {
  const { t } = useTranslation()
  return (
    <MainLayout>
      <div className="container py-16 md:py-24">
        {/* Hero Section */}
        <div className="max-w-3xl mx-auto text-center mb-20 animate-reveal">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 italic text-primary">
            {t('about.hero_title')}
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            {t('about.hero_description')}
          </p>
        </div>

        {/* Our Story */}
        <div className="grid md:grid-cols-2 gap-16 items-center mb-24">
          <div className="space-y-6 animate-reveal animate-delay-100">
            <h2 className="text-3xl font-bold">{t('about.story_title')}</h2>
            <div className="space-y-4 text-lg text-muted-foreground">
              <p>
                {t('about.story_p1')}
              </p>
              <p>
                {t('about.story_p2')}
              </p>
            </div>
          </div>
          <div className="relative group animate-reveal animate-delay-200 flex justify-center">
            <div className="relative bg-white dark:bg-muted/10 rounded-[2rem] overflow-hidden aspect-square border shadow-lg transition-transform duration-500 hover:scale-[1.02] max-w-sm w-full p-12 flex items-center justify-center">
              <Logo className="h-40 w-auto scale-150" />
            </div>
          </div>
        </div>

        {/* Values */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
          <div className="p-8 rounded-2xl border bg-card animate-reveal animate-delay-100">
            <Users className="w-10 h-10 text-primary mb-4" />
            <h3 className="text-xl font-bold mb-3">{t('about.value1_title')}</h3>
            <p className="text-muted-foreground">{t('about.value1_desc')}</p>
          </div>
          <div className="p-8 rounded-2xl border bg-card animate-reveal animate-delay-200">
            <Heart className="w-10 h-10 text-primary mb-4" />
            <h3 className="text-xl font-bold mb-3">{t('about.value2_title')}</h3>
            <p className="text-muted-foreground">{t('about.value2_desc')}</p>
          </div>
          <div className="p-8 rounded-2xl border bg-card animate-reveal animate-delay-300">
            <Shield className="w-10 h-10 text-primary mb-4" />
            <h3 className="text-xl font-bold mb-3">{t('about.value3_title')}</h3>
            <p className="text-muted-foreground">{t('about.value3_desc')}</p>
          </div>
        </div>

        {/* Team Footer */}
        <div className="text-center p-12 rounded-3xl bg-primary text-primary-foreground animate-reveal animate-delay-300">
          <h2 className="text-2xl font-bold mb-4">{t('about.footer_title')}</h2>
          <p className="opacity-90 max-w-xl mx-auto">
            {t('about.footer_desc')}
          </p>
        </div>
      </div>
    </MainLayout>
  )
}
