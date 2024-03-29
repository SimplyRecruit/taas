import { ICON_TOP_MARGIN_FIX, Route } from '@/constants'
import {
  Avatar,
  Button,
  Dropdown,
  MenuProps,
  message,
  Space,
  Typography,
} from 'antd'
import { User } from 'models'
import Language, { LANGUAGES, LANGUAGE_NAMES } from 'models/common/Language'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useTranslation } from 'next-i18next'
import {
  FiChevronDown,
  FiChevronLeft,
  FiChevronRight,
  FiLock,
  FiLogOut,
  FiSettings,
} from 'react-icons/fi'
import { MdLanguage } from 'react-icons/md'
import Cookies from 'universal-cookie'
import { getUserFromCookies } from '@/auth/utils/AuthUtil'
import useApi from '@/services/useApi'

type MenuType = 'main' | 'lang'

export default function ProfileMenu() {
  const [user, setUser] = useState<User>(null!)
  const [ppSrc, setPpSrc] = useState<string>()
  const [currentMenuType, setCurrentMenuType] = useState<MenuType>('main')
  const [open, setOpen] = useState<boolean>(false)
  const router = useRouter()
  const { t, i18n } = useTranslation('common')
  const [messageApi, contextHolder] = message.useMessage()
  const { call: sendPasswordResetEmail } = useApi('user', 'forgotPassword')

  useEffect(() => {
    const currentUser = getUserFromCookies()
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
        key: 'change-password',
        icon: <FiLock />,
        label: t('profileMenu.change-password'),
        onClick: async () => {
          await sendPasswordResetEmail({ email: user.email })
          await new Promise(resolve => setTimeout(resolve, 3000))
          router.push(Route.Logout)
          messageApi.success(
            'Check your email for a link to reset your password. If it doesn’t appear within a few minutes, check your spam folder.'
          )
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

  if (!user) return null
  return (
    <div>
      {contextHolder}
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
                <Typography.Text>{user.name}</Typography.Text>
              </div>
              <div>
                <Typography.Text
                  style={{
                    fontSize: 12,
                    color: 'darkgrey',
                    fontWeight: 'bold',
                  }}
                >
                  {user.role}
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
