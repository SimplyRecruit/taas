import { ICON_TOP_MARGIN_FIX, Route } from '@/constants'
import { Avatar, Button, Dropdown, MenuProps, Space, Typography } from 'antd'
import { useRouter } from 'next/router'
import { FiChevronDown, FiLogOut, FiSettings } from 'react-icons/fi'

export default function ProfileMenu() {
  const router = useRouter()

  const name = 'John Doe'

  const items: MenuProps['items'] = [
    {
      key: 'settings',
      icon: <FiSettings />,
      label: 'Settings',
      onClick: () => {
        router.push(Route.ProfileSettings)
      },
    },
    {
      key: 'signOut',
      icon: <FiLogOut />,
      label: 'Sign Out',
      onClick: () => {
        console.log('deneme')
        router.push(Route.Logout)
      },
    },
  ]

  return (
    <div>
      <Dropdown
        menu={{
          items,
        }}
        placement="bottomLeft"
        trigger={['click']}
      >
        <Button type="text" style={{ paddingTop: 0, paddingBottom: 0 }}>
          <Space size="small" align="center">
            <Avatar size={'small'} style={{}}>
              BE
            </Avatar>
            <Typography.Text>{name}</Typography.Text>
            <FiChevronDown
              size={16}
              style={{ marginTop: ICON_TOP_MARGIN_FIX }}
            />
          </Space>
        </Button>
      </Dropdown>
    </div>
  )
}
