import { useTranslation } from 'react-i18next'
import {
  LayoutDashboard,
  Wallet,
  Calendar,
  CheckSquare,
  HeartPulse,
  Target,
  ShoppingBag,
  Gift,
  StickyNote,
  Home,
  BarChart3,
  Bell,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const FEATURE_ICONS = {
  dashboard: LayoutDashboard,
  finance: Wallet,
  calendar: Calendar,
  todo: CheckSquare,
  period: HeartPulse,
  goals: Target,
  shopping: ShoppingBag,
  special_days: Gift,
  journal: StickyNote,
  chores: Home,
  stats: BarChart3,
  notifications: Bell,
}

export function FeaturesSection() {
  const { t } = useTranslation()

  const features = Object.keys(FEATURE_ICONS) as Array<keyof typeof FEATURE_ICONS>

  return (
    <section id="features" className="py-24 bg-muted/30">
      <div className="container px-4 mx-auto">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            {t('common.features_section_title')}
          </h2>
          <p className="text-lg text-muted-foreground">
            {t('common.features_section_subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {features.map((featureKey, index) => {
            const Icon = FEATURE_ICONS[featureKey]
            return (
              <div
                key={featureKey}
                style={{ animationDelay: `${index * 50}ms` }}
                className={cn(
                  "animate-reveal group p-8 rounded-2xl bg-background border transition-all duration-300",
                  "hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 hover:border-primary/20"
                )}
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">
                  {t(`common.features.${featureKey}.title`)}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {t(`common.features.${featureKey}.desc`)}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
