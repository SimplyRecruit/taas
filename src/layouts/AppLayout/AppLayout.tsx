import ProfileMenu from '@/components/ProfileMenu'
import { HEADER_HEIGHT, Route, SIDER_WIDTH } from '@/constants'
import { Layout, Menu, Space, Typography } from 'antd'
import { useRouter } from 'next/router'
import { adminMenuItems, topMenuItems } from './menu-items'
import Link from 'next/link'
import { useTranslation } from 'next-i18next'
import Image from 'next/image'
import { UserRole } from 'models'

type MenuItem = {
  icon: JSX.Element
  label: string
  path: string
  type?: string
}

interface AppLayoutProps {
  children: React.ReactNode
  role: string
}

export default function AppLayout({ children, role }: AppLayoutProps) {
  const { t } = useTranslation('common')
  const router = useRouter()
  // TODO : find a better way to handle role based routes
  const topItems =
    role === UserRole.ADMIN
      ? topMenuItems
      : topMenuItems.filter(e => e.path !== Route.TeamTracker)

  const adminItems =
    role === UserRole.ADMIN
      ? [
          {
            label: '‏ ‏ ‏' + t('navigationMenu.manage'),
            key: 'admin',
            children: generateMenuItems(adminMenuItems),
            type: 'group',
          },
        ]
      : []

  return (
    <Layout>
      <Layout.Header
        style={{
          height: HEADER_HEIGHT,
          borderBottom: '1px solid #ddd',
          padding: '0 2rem 0 0.8rem',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            height: '100%',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              height: '100%',
              padding: 18,
            }}
          >
            <Image
              alt="logo"
              src="/logo.png"
              width={0}
              height={0}
              sizes="100vh"
              style={{ width: 'auto', height: '100%' }} // optional
            />
            <Typography.Title level={5} style={{ margin: 0, marginLeft: 10 }}>
              {t('appTitle')}
            </Typography.Title>
          </div>
          <Space size="large" align="center">
            <ProfileMenu />
          </Space>
        </div>
      </Layout.Header>
      <Layout
        style={{
          height: `calc(100vh - ${HEADER_HEIGHT}px)`,
        }}
      >
        <Layout.Sider theme="light" width={SIDER_WIDTH}>
          <Menu
            items={[...generateMenuItems(topItems), ...adminItems]}
            mode="inline"
            selectedKeys={[router.pathname.split('/')[1]]}
          />
        </Layout.Sider>
        {/* To put scrollbar inside the content */}
        <Layout.Content style={{ overflowY: 'auto', padding: 20 }}>
          {children}
        </Layout.Content>
      </Layout>
    </Layout>
  )
  function generateMenuItems(items: MenuItem[]) {
    return items.map(({ label, icon, path }) => ({
      key: path.split('/')[1],
      icon: <Link href={path}>{icon}</Link>,
      label: <Link href={path}>{t('navigationMenu.' + label)}</Link>,
    }))
  }
}
