import { createFileRoute } from '@tanstack/react-router'
import { MainLayout } from '@/layouts/MainLayout'
import { HeroSection } from '@/features/home/components/HeroSection'

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  return (
    <MainLayout>
      <HeroSection />
    </MainLayout>
  )
}
