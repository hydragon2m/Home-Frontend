import { createFileRoute } from '@tanstack/react-router'
import { MainLayout } from '@/layouts/MainLayout'
import { useTranslation } from 'react-i18next'
import { 
  BookOpen, 
  ChevronRight,
  LayoutDashboard,
  Wallet,
  Calendar,
  CheckSquare,
  HeartPulse,
  Target,
  ShoppingBag,
  Gift,
  StickyNote,
  Home as HomeIcon,
  BarChart3,
  Bell,
} from 'lucide-react'

export const Route = createFileRoute('/guide')({
  component: GuidePage,
})

const GUIDE_SECTIONS = [
  { id: 'dashboard', icon: LayoutDashboard },
  { id: 'finance', icon: Wallet },
  { id: 'calendar', icon: Calendar },
  { id: 'todo', icon: CheckSquare },
  { id: 'period', icon: HeartPulse },
  { id: 'goals', icon: Target },
  { id: 'shopping', icon: ShoppingBag },
  { id: 'special_days', icon: Gift },
  { id: 'journal', icon: StickyNote },
  { id: 'chores', icon: HomeIcon },
  { id: 'stats', icon: BarChart3 },
  { id: 'notifications', icon: Bell },
]

function GuidePage() {
  const { t } = useTranslation()

  return (
    <MainLayout>
      <div className="container py-12 md:py-20 max-w-5xl">
        <div className="flex flex-col items-center text-center space-y-4 mb-16">
          <div className="p-3 rounded-2xl bg-primary/10 text-primary mb-2">
            <BookOpen className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            {t('common.guide')}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl">
            {t('common.features_section_subtitle')}
          </p>
        </div>

        <div className="space-y-12">
          {GUIDE_SECTIONS.map((section) => (
            <div 
              key={section.id} 
              className="group scroll-mt-24 p-8 rounded-3xl bg-background border transition-all hover:shadow-lg"
              id={section.id}
            >
              <div className="flex flex-col md:flex-row gap-8">
                <div className="w-16 h-16 shrink-0 rounded-2xl bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <section.icon className="w-8 h-8" />
                </div>
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    {t(`common.features.${section.id}.title`)}
                    <ChevronRight className="w-5 h-5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-primary" />
                  </h2>
                  <div className="prose prose-slate dark:prose-invert max-w-none">
                    <p className="text-lg leading-relaxed text-muted-foreground">
                      {t(`common.features.${section.id}.desc`)}
                    </p>
                    {/* Placeholder for more detailed guide text */}
                    <div className="mt-6 p-6 rounded-2xl bg-muted/30 border border-dashed text-sm italic text-muted-foreground">
                      Dữ liệu hướng dẫn chi tiết cho tính năng "{t(`common.features.${section.id}.title`)}" đang được biên soạn...
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  )
}
