import ProfileMenu from '@/components/ProfileMenu'
import { HEADER_HEIGHT, ICON_TOP_MARGIN_FIX, SIDER_WIDTH } from '@/constants'
import { QuestionCircleOutlined } from '@ant-design/icons'
import { Badge, Button, Layout, Menu, Space, Typography } from 'antd'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { FiBell } from 'react-icons/fi'
import { adminMenuItems, topMenuItems } from './menu-items'
import Link from 'next/link'
import { useTranslation } from 'next-i18next'
import Image from 'next/image'

type MenuItem = {
  icon: JSX.Element
  label: string
  path: string
}

interface AppLayoutProps {
  children: React.ReactNode
}

export default function AppLayout({ children }: AppLayoutProps) {
  const { t } = useTranslation('common')
  const router = useRouter()
  const [sidebarCollapsed] = useState(false)

  return (
    <Layout>
      <Layout.Header
        style={{
          height: HEADER_HEIGHT,
          borderBottom: '1px solid #ddd',
          padding: '0 2rem 0 1rem',
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
            }}
          >
            <Image
              alt="logo"
              src="/logo.jpeg"
              width={0}
              height={0}
              sizes="100vh"
              style={{ width: 'auto', height: '100%' }} // optional
            />
            <Typography.Title level={5} style={{ margin: 0 }}>
              TaaS Aktivite Sistemi
            </Typography.Title>
          </div>
          <Space size="large" align="center">
            <Button
              icon={<QuestionCircleOutlined />}
              target="_blank"
              type="text"
            >
              Help
            </Button>
            <div style={{ marginTop: ICON_TOP_MARGIN_FIX }}>
              <Badge
                color="red"
                count={9}
                style={{
                  cursor: 'pointer',
                }}
                size="small"
                offset={[1, -1]}
              >
                <FiBell size={18} />
              </Badge>
            </div>
            <ProfileMenu />
          </Space>
        </div>
      </Layout.Header>
      <Layout
        style={{
          height: `calc(100vh - ${HEADER_HEIGHT}px)`,
        }}
      >
        <Layout.Sider
          collapsible
          collapsed={sidebarCollapsed}
          theme="light"
          trigger={null}
          width={SIDER_WIDTH}
        >
          <div style={{ height: '100%' }}>
            <Menu
              items={generateMenuItems(topMenuItems)}
              mode="inline"
              selectedKeys={[router.pathname.split('/')[1]]}
            />
            <Menu
              style={{ height: '100%' }}
              items={[
                {
                  label: '‏ ‏ ‏' + t('navigationMenu.manage'),
                  key: 'admin',
                  children: generateMenuItems(adminMenuItems),
                  type: 'group',
                },
              ]}
              mode="inline"
              selectedKeys={[router.pathname.split('/')[1]]}
            />
          </div>
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
