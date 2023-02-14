import AppLayout from '@/layouts/AppLayout'
import '@/styles/globals.css'
import { appWithTranslation } from 'next-i18next'
import type { AppProps } from 'next/app'
import Head from 'next/head'

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <Head>
        <title>taas app</title>
        <link href="/favicon.ico" rel="shortcut icon" />
        <link href="/logo192.png" rel="apple-touch-icon" />
      </Head>
      <AppLayout>
        <Component {...pageProps} />
      </AppLayout>
    </>
  )
}

export default appWithTranslation(App)
