import { FiSettings, FiLogOut, FiChevronDown } from 'react-icons/fi';
import { MenuProps, Dropdown, Space, Typography, Button, Avatar } from 'antd';
import { useRouter } from 'next/router';
import { ICON_TOP_MARGIN_FIX } from '@/src/shared/constants';


export default function CurrentUserMenu() {
  const router = useRouter();


  const name = 'John Doe';

  const items: MenuProps['items'] = [
    {
      key: 'settings',
      icon: <FiSettings />,
      label: 'Settings',
      onClick: () => {
        router.push('/settings');
      },
    },
    {
      key: 'signOut',
      icon: <FiLogOut />,
      label: 'Sign Out',
      onClick: () => {
        router.push('/logout');
      },
    },
  ];

  return (
    <div>
      <Dropdown
        menu={{
          items,
        }}
        placement="bottomLeft"
        trigger={['click']}
      >
        <Button type="text" style={{ paddingTop: 0, paddingBottom: 0 }} >
          <Space size="small" align='center'>
            <Avatar size={'small'} style={{

            }}>BE</Avatar>
            <Typography.Text style={{ margin: 0 }}>{name}</Typography.Text>
            <FiChevronDown size={16} style={{ marginTop: ICON_TOP_MARGIN_FIX }} />
          </Space>
        </Button>
      </Dropdown>

    </div>
  );
}
