import 'antd/dist/reset.css'
import '@/styles/globals.css'
import { ConfigProvider } from 'antd'
import dayjs from 'dayjs'
import { appWithTranslation, useTranslation } from 'next-i18next'
import App, { AppContext, AppProps } from 'next/app'
import Head from 'next/head'
import tr from 'antd/locale/tr_TR'
import en from 'antd/locale/en_US'
import 'dayjs/locale/tr'
import updateLocale from 'dayjs/plugin/updateLocale'
import type { Locale } from 'antd/es/locale'
import { Language, User, UserRole } from 'models'
import TaasLayout from '@/layouts/TaasLayout'
import cookieKeys from '@/constants/cookie-keys'
import { GetServerSideProps } from 'next'
import Cookies from 'universal-cookie'
dayjs.extend(updateLocale)

const TaasApp = ({
  Component,
  pageProps,
  role,
}: AppProps & { role: UserRole }) => {
  const antdLocales: { [key in Language]: Locale } = { en, tr } as const
  const {
    t,
    i18n: { language: l },
  } = useTranslation('common')
  const lang = l as Language
  dayjs.updateLocale(lang, {
    weekStart: 1,
  })
  const title = 'BASİSCİ ' + t('appTitle')
  return (
    <>
      <Head>
        <title>{title}</title>
        <link href="/apple-touch-icon.png" rel="apple-touch-icon" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
      </Head>
      <ConfigProvider locale={antdLocales[lang] ?? antdLocales['tr']}>
        <TaasLayout role={role}>
          <Component {...pageProps} />
        </TaasLayout>
      </ConfigProvider>
    </>
  )
}

export function getUserFromCookies(req: any): User | null {
  const cookies = new Cookies(req.headers.cookie)
  const user = cookies.get(cookieKeys.COOKIE_USER_OBJECT) as User
  return user ? user : null
}

TaasApp.getInitialProps = async (context: AppContext) => {
  const initialProps = await App.getInitialProps(context)

  const user = getUserFromCookies(context.ctx.req)

  console.log({ req: context.ctx.req, user })

  const role = user ? user.role : null

  return {
    ...initialProps,
    role,
  }
}

export default appWithTranslation(TaasApp)
