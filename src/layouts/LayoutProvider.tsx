import { allWelcomeRoutes, authRoutes } from '@/auth/utils/AuthUtil'
import { Route } from '@/constants'
import AppLayout from '@/layouts/AppLayout'

import AuthLayout from '@/layouts/AuthLayout'
import ColorProvider from '@/layouts/theme/ColorProvider'
import ThemeProvider from '@/layouts/theme/ThemeProvider'

import { useRouter } from 'next/router'

interface AppLayoutProps {
  children: React.ReactNode
}

export default function LayoutProvider({ children }: AppLayoutProps) {
  const router = useRouter()
  let layout: React.ReactNode
  if (
    authRoutes.includes(router.pathname as Route) ||
    allWelcomeRoutes.includes(router.pathname)
  )
    layout = <AuthLayout>{children}</AuthLayout>
  else if (router.pathname === '/_error') layout = <div>{children}</div>
  else layout = <AppLayout>{children}</AppLayout>
  return (
    <ColorProvider>
      <ThemeProvider>{layout}</ThemeProvider>
    </ColorProvider>
  )
}
