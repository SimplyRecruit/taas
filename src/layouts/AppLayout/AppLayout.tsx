import { authRoutes } from '@/auth/utils/AuthUtil'
import ProfileMenu from '@/components/ProfileMenu'
import {
  HEADER_HEIGHT,
  ICON_TOP_MARGIN_FIX,
  Route,
  SIDER_WIDTH,
} from '@/constants'
import { QuestionCircleOutlined } from '@ant-design/icons'
import {
  Badge,
  Button,
  ConfigProvider,
  Layout,
  Menu,
  Space,
  Typography,
} from 'antd'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { FiBell } from 'react-icons/fi'
import { adminMenuItems, analyseMenuItems, topMenuItems } from './menu-items'

interface AppLayoutProps {
  children: React.ReactNode
}

export default function AppLayout({ children }: AppLayoutProps) {
  const router = useRouter()
  const [sidebarCollapsed] = useState(false)
  if (
    authRoutes.includes(router.pathname as Route) ||
    router.pathname === '/_error'
  ) {
    return <div>{children}</div>
  }

  return (
    <ConfigProvider
      theme={{
        token: {
          controlHeight: 40,
          colorBgBase: '#F9FAFD',
          colorBgLayout: '#F9FAFD',
        },
      }}
    >
      <Layout>
        <Layout.Header
          style={{
            backgroundColor: '#F9FAFD',
            height: HEADER_HEIGHT,
            borderBottom: '1px solid #ddd',
            padding: '0 2rem 0 2rem',
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
            <Typography.Title level={5} style={{ margin: 0 }}>
              Test
            </Typography.Title>
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

        <Layout style={{ height: `calc(100vh - ${HEADER_HEIGHT}px)` }}>
          <Layout.Sider
            collapsible
            collapsed={sidebarCollapsed}
            theme="light"
            trigger={null}
            width={SIDER_WIDTH}
          >
            <div style={{ height: '100%' }}>
              <Menu
                items={topMenuItems}
                mode="inline"
                selectedKeys={[router.pathname.split('/')[1]]}
              />
              <Menu
                items={[
                  {
                    label: '‏ ‏ ‏ Analyse',
                    key: 'analyse',
                    children: analyseMenuItems,
                    type: 'group',
                  },
                ]}
                mode="inline"
                selectedKeys={[router.pathname.split('/')[1]]}
              />
              <Menu
                style={{ height: '100%' }}
                items={[
                  {
                    label: '‏ ‏ ‏ Manage',
                    key: 'admin',
                    children: adminMenuItems,
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
    </ConfigProvider>
  )
}
