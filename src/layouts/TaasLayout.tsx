import { allWelcomeRoutes, authRoutes } from '@/auth/utils/AuthUtil'
import { Route } from '@/constants'
import AppLayout from '@/layouts/AppLayout'

import AuthLayout from '@/layouts/AuthLayout'
import ColorProvider from '@/layouts/theme/ColorProvider'
import ThemeProvider from '@/layouts/theme/ThemeProvider'
import { UserRole } from 'models'

import { useRouter } from 'next/router'

interface TaasLayoutProps {
  children: React.ReactNode
  role: UserRole
}

export default function TaasLayout({ children, role }: TaasLayoutProps) {
  const router = useRouter()
  let layout: React.ReactNode
  if (
    authRoutes.includes(router.pathname as Route) ||
    allWelcomeRoutes.includes(router.pathname)
  )
    layout = <AuthLayout>{children}</AuthLayout>
  else if (router.pathname === '/_error') layout = <div>{children}</div>
  else layout = <AppLayout role={role}>{children}</AppLayout>
  return (
    <ColorProvider>
      <ThemeProvider>{layout}</ThemeProvider>
    </ColorProvider>
  )
}
