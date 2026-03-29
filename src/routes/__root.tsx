import { createRootRoute, Outlet } from '@tanstack/react-router'

import { ScrollToTop } from '@/components/elements/ScrollToTop'

export const Route = createRootRoute({
  component: () => (
    <>
      <Outlet />
      <ScrollToTop />
    </>
  ),
})
