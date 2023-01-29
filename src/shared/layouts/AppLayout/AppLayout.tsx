import { bottomMenuItems, topMenuItems } from './menu-items';
import { HEADER_HEIGHT, SIDER_WIDTH } from 'src/shared/constants';
import { Badge, Button, ConfigProvider, Layout, Menu, Space, Typography } from 'antd';
import { useRouter } from 'next/router';
import { FiBell } from 'react-icons/fi';
import { SearchOutlined } from '@ant-design/icons';
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
        },
      }}
    >
      <Layout>
        <Layout.Header >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              height: '100%'
            }}
          >
            <Typography.Title level={5} style={{ margin: 0 }}>
              Test
            </Typography.Title>
            <Space align="center" size="large">
              <Button
                icon={<SearchOutlined />}
                target="_blank"
                type="text"
              >
                Need help?
              </Button>
              <CurrentUserMenu />
              <Badge
                color="red"
                count={9}
                style={{
                  cursor: "pointer",
                  marginTop: "1.8rem"
                }}
                offset={[5, -5]}
              >
                <FiBell size={16} />
              </Badge>
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
