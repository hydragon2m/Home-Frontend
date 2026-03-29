import { createFileRoute } from '@tanstack/react-router'
import { MainLayout } from '@/layouts/MainLayout'
import { HeroSection } from '@/features/home/components/HeroSection'
import { FeaturesSection } from '@/features/home/components/FeaturesSection'

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  return (
    <MainLayout>
      <HeroSection />
      <FeaturesSection />
    </MainLayout>
  )
}
