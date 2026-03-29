import type { ReactNode } from 'react'
import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { useTranslation } from 'react-i18next'
import { LanguageToggle } from '@/components/elements/LanguageToggle'
import { ModeToggle } from '@/components/elements/ModeToggle'
import { Logo } from '@/components/elements/Logo'

export function MainLayout({ children }: { children: ReactNode }) {
  const { t } = useTranslation()

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="font-bold text-xl tracking-tight">
            <Link to="/">
              <Logo />
            </Link>
          </div>
          <nav className="flex items-center space-x-6">
            <Link to="/" className="text-sm font-medium transition-colors hover:text-primary">
              {t('common.home')}
            </Link>
            <Link to="/" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
              {t('common.features')}
            </Link>
            <div className="flex items-center gap-2">
              <LanguageToggle />
              <ModeToggle />
            </div>
            <Button variant="default" size="sm">{t('common.getStarted')}</Button>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t py-6 md:py-0 mt-auto">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built by Hydra Inc.
          </p>
        </div>
      </footer>
    </div>
  )
}
