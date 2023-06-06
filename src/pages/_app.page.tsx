import 'antd/dist/reset.css'
import '@/styles/globals.css'
import { ConfigProvider } from 'antd'
import dayjs from 'dayjs'
import { appWithTranslation, useTranslation } from 'next-i18next'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import tr from 'antd/locale/tr_TR'
import en from 'antd/locale/en_US'
import 'dayjs/locale/tr'
import updateLocale from 'dayjs/plugin/updateLocale'
import type { Locale } from 'antd/es/locale'
import { Language } from 'models'
import TaasLayout from '@/layouts/TaasLayout'
dayjs.extend(updateLocale)

const App = ({ Component, pageProps }: AppProps) => {
  const antdLocales: { [key in Language]: Locale } = { en, tr } as const
  const {
    i18n: { language: l },
  } = useTranslation()
  const lang = l as Language
  dayjs.updateLocale(lang, {
    weekStart: 1,
  })
  return (
    <>
      <Head>
        <title>TaaS Aktivite Sistemi</title>
        <link href="/favicon.ico" rel="shortcut icon" />
        <link href="/apple-touch-icon.png" rel="apple-touch-icon" />
      </Head>
      <ConfigProvider locale={antdLocales[lang] ?? antdLocales['en']}>
        <TaasLayout>
          <Component {...pageProps} />
        </TaasLayout>
      </ConfigProvider>
    </>
  )
}

export default appWithTranslation(App)
