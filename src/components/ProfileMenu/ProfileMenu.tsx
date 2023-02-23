import { ICON_TOP_MARGIN_FIX, Route } from '@/constants'
import cookieKeys from '@/constants/cookie-keys'
import { Avatar, Button, Dropdown, MenuProps, Space, Typography } from 'antd'
import { User } from 'models'
import Language, { LANGUAGES, LANGUAGE_NAMES } from 'models/Language'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useTranslation } from 'next-i18next'
import {
  FiChevronDown,
  FiChevronLeft,
  FiChevronRight,
  FiLogOut,
  FiSettings,
} from 'react-icons/fi'
import { MdLanguage } from 'react-icons/md'
import Cookies from 'universal-cookie'

type MenuType = 'main' | 'lang'

export default function ProfileMenu() {
  const [user, setUser] = useState<User>()
  const [ppSrc, setPpSrc] = useState<string>()
  const [currentMenuType, setCurrentMenuType] = useState<MenuType>('main')
  const [open, setOpen] = useState<boolean>(false)
  const router = useRouter()
  const { t, i18n } = useTranslation('common')

  useEffect(() => {
    const currentUser = new Cookies().get(cookieKeys.COOKIE_USER_OBJECT) as User
    if (!currentUser) return
    setUser(currentUser)
    setPpSrc(
      `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.name)}`
    )
  }, [])

  function handleOpenChange(isOpen: boolean) {
    setOpen(isOpen)
    setCurrentMenuType('main')
  }

  function changeLanguage(locale: string) {
    new Cookies().set('NEXT_LOCALE', locale, { path: '/' })
    router.push(
      { pathname: router.pathname, query: router.query },
      router.asPath,
      { locale }
    )
  }

  const commonItems: MenuProps['items'] = [
    {
      key: 'back',
      label: t('button.back'),
      icon: <FiChevronLeft size={16} />,
      onClick: () => {
        setCurrentMenuType('main')
      },
    },
    { type: 'divider' },
  ]

  const items: { [key in MenuType]: Exclude<MenuProps['items'], undefined> } = {
    main: [
      {
        key: 'settings',
        icon: <FiSettings />,
        label: t('profileMenu.settings'),
        onClick: () => {
          router.push(Route.ProfileSettings)
        },
      },
      {
        key: 'language',
        icon: <MdLanguage />,
        label: (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Typography.Text>
              {t('profileMenu.language', {
                lang: LANGUAGE_NAMES[i18n.language as Language],
              })}
            </Typography.Text>
            <FiChevronRight style={{ marginLeft: 10 }} size={16} />
          </div>
        ),
        onClick: () => {
          setCurrentMenuType('lang')
        },
      },
      {
        key: 'signOut',
        icon: <FiLogOut />,
        label: t('profileMenu.signOut'),
        onClick: () => {
          console.log('deneme')
          router.push(Route.Logout)
        },
      },
    ],
    lang: LANGUAGES.map(lang => ({
      key: lang,
      label: LANGUAGE_NAMES[lang],
      onClick: () => {
        changeLanguage(lang)
        setOpen(false)
      },
    })),
  }

  return (
    <div>
      <Dropdown
        open={open}
        onOpenChange={handleOpenChange}
        menu={{
          items: [
            ...(currentMenuType !== 'main' ? commonItems : []),
            ...items[currentMenuType],
          ],
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
