import AppLayout from '@/layouts/AppLayout'
import '@/styles/globals.css'
import { ConfigProvider } from 'antd'
import { appWithTranslation, useTranslation } from 'next-i18next'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import tr from 'antd/locale/tr_TR'
import en from 'antd/locale/en_US'
import type { Locale } from 'antd/es/locale'
import { Language } from 'models'

const App = ({ Component, pageProps }: AppProps) => {
  const antdLocales: { [key in Language]: Locale } = { en, tr } as const
  const {
    i18n: { language: l },
  } = useTranslation()
  const lang = l as Language
  return (
    <>
      <Head>
        <title>taas app</title>
        <link href="/favicon.ico" rel="shortcut icon" />
        <link href="/logo192.png" rel="apple-touch-icon" />
      </Head>
      <ConfigProvider locale={antdLocales[lang] ?? antdLocales['en']}>
        <AppLayout>
          <Component {...pageProps} />
        </AppLayout>
      </ConfigProvider>
    </>
  )
}

export default appWithTranslation(App)
