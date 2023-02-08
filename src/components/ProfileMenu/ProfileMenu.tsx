import { ICON_TOP_MARGIN_FIX, Route } from '@/constants'
import cookieKeys from '@/constants/cookie-keys'
import { Avatar, Button, Dropdown, MenuProps, Space, Typography } from 'antd'
import { User } from 'models'
import { useRouter } from 'next/router'
import { FiChevronDown, FiLogOut, FiSettings } from 'react-icons/fi'
import Cookies from 'universal-cookie'

export default function ProfileMenu() {
  const router = useRouter()
  const name = (new Cookies().get(cookieKeys.COOKIE_USER_OBJECT) as User).name

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
