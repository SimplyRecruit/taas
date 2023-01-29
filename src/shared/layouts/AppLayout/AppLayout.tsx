import { bottomMenuItems, topMenuItems } from './menu-items';
import { HEADER_HEIGHT, SIDER_WIDTH, ICON_TOP_MARGIN_FIX } from 'src/shared/constants';
import { Avatar, Badge, Button, ConfigProvider, Divider, Layout, Menu, Space, Typography } from 'antd';
import { useRouter } from 'next/router';
import { FiBell, FiChevronDown, FiHelpCircle } from 'react-icons/fi';
import { QuestionCircleOutlined, BellOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { useState } from 'react';
import Image from 'next/image';
import CurrentUserMenu from '@/src/shared/components/CurrentUserMenu';

interface PlatformLayoutProps {
  children: React.ReactNode;
}

export default function PlatformLayout({ children }: PlatformLayoutProps) {
  const router = useRouter();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);


  return (
    <ConfigProvider
      theme={{
        token: {
          controlHeight: 40,
          colorBgBase: '#F9FAFD',
          colorBgLayout: "#F9FAFD",
        },
      }}
    >
      <Layout>
        <Layout.Header style={{ backgroundColor: "#F9FAFD", height: HEADER_HEIGHT, borderBottom: '1px solid #ddd' }}>
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
            <Space size="large" align="center" >
              <Button
                target="_blank"
                type="text"
              >
                <Space size='small' align='center'>
                  <QuestionCircleOutlined />
                  <Typography>Help</Typography>
                </Space>
              </Button>
              <div style={{ marginTop: ICON_TOP_MARGIN_FIX }}>
                <Badge
                  color="red"
                  count={9}
                  style={{
                    cursor: "pointer",
                  }}
                  size="small"
                  offset={[3, 0]}
                >
                  <FiBell size={16} />
                </Badge>
              </div>
              <CurrentUserMenu />
            </Space>
          </div>

        </Layout.Header>

        <Layout style={{ height: `calc(100vh - ${HEADER_HEIGHT}px)` }}>
          <Layout.Sider
            collapsible
            collapsed={sidebarCollapsed}
            style={{ backgroundColor: '#F9FAFD', }}
            theme="light"
            trigger={null}
            width={SIDER_WIDTH}
            onMouseEnter={() => setSidebarCollapsed(false)}
            onMouseLeave={() => setSidebarCollapsed(true)}
          >

            <div>
              <Menu
                style={{ height: '100%' }}
                items={topMenuItems}
                mode="inline"
                selectedKeys={[router.pathname.split('/')[1]]}
              />
              <Menu
                style={{ height: '100%' }}
                items={[{ label: "ADMIN", key: "AS", children: topMenuItems, type: "group" }]}
                mode="inline"
                selectedKeys={[router.pathname.split('/')[1]]}
              />
            </div>

          </Layout.Sider>
          <Layout.Content>{children}</Layout.Content>
        </Layout>
      </Layout>
    </ConfigProvider >
  );
}
