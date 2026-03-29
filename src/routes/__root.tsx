import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'

import { ScrollToTop } from '@/components/elements/ScrollToTop'

export const Route = createRootRoute({
  component: () => (
    <>
      <Outlet />
      <ScrollToTop />
      <TanStackRouterDevtools />
    </>
  ),
})
