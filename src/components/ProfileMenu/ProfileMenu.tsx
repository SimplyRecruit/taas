import { ICON_TOP_MARGIN_FIX, Route } from '@/constants'
import cookieKeys from '@/constants/cookie-keys'
import { Avatar, Button, Dropdown, MenuProps, Space, Typography } from 'antd'
import { User } from 'models'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { FiChevronDown, FiLogOut, FiSettings } from 'react-icons/fi'
import Cookies from 'universal-cookie'

export default function ProfileMenu() {
  const [user, setUser] = useState<User>()
  const [ppSrc, setPpSrc] = useState<string>()
  const router = useRouter()

  useEffect(() => {
    const currentUser = new Cookies().get(cookieKeys.COOKIE_USER_OBJECT) as User
    if (!currentUser) return
    setUser(currentUser)
    setPpSrc(
      `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.name)}`
    )
  }, [])

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
            <Avatar size={'small'} style={{}} src={ppSrc}>
              BE
            </Avatar>
            <div>
              <div>
                <Typography.Text>{user?.name}</Typography.Text>
              </div>
              <div>
                <Typography.Text
                  style={{
                    fontSize: 12,
                    color: 'darkgrey',
                    fontWeight: 'bold',
                  }}
                >
                  {user?.role}
                </Typography.Text>
              </div>
            </div>
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
