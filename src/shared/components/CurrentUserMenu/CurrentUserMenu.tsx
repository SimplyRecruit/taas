import { FiSettings, FiLogOut, FiHelpCircle } from 'react-icons/fi';
import { MenuProps, Dropdown, Space, Typography, Button } from 'antd';
import { useRouter } from 'next/router';


export default function CurrentUserMenu() {
  const router = useRouter();


  const name = 'test';

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
      key: 'help',
      icon: <FiHelpCircle />,
      label: 'Help',
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
    <Dropdown
      menu={{
        items,
      }}
      placement="bottomLeft"
      trigger={['click']}
    >
      <Button type="link">

        <Space size="small">

          <Typography.Text>{name}</Typography.Text>
        </Space>

      </Button>
    </Dropdown>
  );
}
