import { bottomMenuItems, topMenuItems } from './menu-items';
import { HEADER_HEIGHT, SIDER_WIDTH } from 'src/shared/constants';
import { ConfigProvider, Layout, Menu } from 'antd';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useState } from 'react';
import Image from 'next/image';

interface PlatformLayoutProps {
  children: React.ReactNode;
}

export default function PlatformLayout({ children }: PlatformLayoutProps) {
  const router = useRouter();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);

  const headerStyle: React.CSSProperties = {
    textAlign: 'center',
    color: '#fff',
    height: 64,
    paddingInline: 50,
    lineHeight: '64px',
    backgroundColor: '#7dbcea',
  };

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
        <Layout.Header style={headerStyle}>
          Test
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
    </ConfigProvider>
  );
}
