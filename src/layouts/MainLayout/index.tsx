import type { ReactNode } from 'react'
import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'
import { Menu, X } from 'lucide-react'
import { Logo } from '@/components/elements/Logo'
import { LanguageToggle } from '@/components/elements/LanguageToggle'
import { ModeToggle } from '@/components/elements/ModeToggle'
import { Button } from '@/components/ui/button'

export function MainLayout({ children }: { children: ReactNode }) {
  const { t } = useTranslation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex-shrink-0 font-bold text-xl tracking-tight">
            <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>
              <Logo />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-sm font-medium transition-colors hover:text-primary">
              {t('common.home')}
            </Link>
            <a href="/#features" className="text-sm font-medium transition-colors hover:text-primary">
              {t('common.features_section_title')}
            </a>
            <Link to="/about" className="text-sm font-medium transition-colors hover:text-primary">
              {t('common.about')}
            </Link>
            <div className="flex items-center gap-2 border-l pl-6 ml-2">
              <LanguageToggle />
              <ModeToggle />
            </div>
            <Button size="sm" asChild>
              <Link to="/login">{t('common.login')}</Link>
            </Button>
          </nav>

          {/* Mobile Menu Toggle */}
          <div className="flex md:hidden items-center gap-2">
            <LanguageToggle />
            <ModeToggle />
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="ml-2"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-b bg-background animate-reveal">
            <nav className="container py-6 flex flex-col gap-4">
              <Link 
                to="/" 
                className="text-lg font-medium px-4 py-2 hover:bg-accent rounded-lg"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t('common.home')}
              </Link>
              <a 
                href="/#features" 
                className="text-lg font-medium px-4 py-2 hover:bg-accent rounded-lg"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t('common.features_section_title')}
              </a>
              <Link 
                to="/about" 
                className="text-lg font-medium px-4 py-2 hover:bg-accent rounded-lg"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t('common.about')}
              </Link>
              <div className="pt-4 mt-2 border-t">
                <Button className="w-full text-lg h-12" asChild onClick={() => setIsMobileMenuOpen(false)}>
                  <Link to="/login">{t('common.login')}</Link>
                </Button>
              </div>
            </nav>
          </div>
        )}
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
