import useApi from '@/services/useApi'
import { Button, Card, Form, Input, Typography } from 'antd'
import { ResetPasswordReqBody } from 'models'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import Cookies from 'universal-cookie'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { GetStaticProps } from 'next/types'
import { Route } from '@/constants'

export default function ForgotPasswordPage() {
  const { t } = useTranslation(['forgot-password', 'common'])
  const router = useRouter()
  const { data, error, loading, call } = useApi('user', 'forgotPassword')
  const [form] = Form.useForm()
  const changeLocale = (locale: string) => {
    new Cookies().set('NEXT_LOCALE', locale, { path: '/' })
    router.push(
      { pathname: router.pathname, query: router.query },
      router.asPath,
      { locale }
    )
  }

  const onFinish = async ({ email }: { email: string }) => {
    try {
      await call({ email })
    } catch (e) {
      /* Invalid Credentials */
    }
  }

  const onFinishFailed = (errorInfo: unknown) => {
    console.log('Failed:', errorInfo)
  }

  return (
    <div
      className="center-column"
      style={{
        backgroundImage:
          'url(https://img.freepik.com/free-vector/hand-painted-watercolor-pastel-sky-background_23-2148902771.jpg?w=2000)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '100vh',
      }}
    >
      <button
        onClick={() => {
          changeLocale('tr')
        }}
      >
        tr
      </button>
      <button
        onClick={() => {
          changeLocale('en')
        }}
      >
        en
      </button>
      <Card className="elevation" style={{ width: '100%', maxWidth: 300 }}>
        <Typography.Title level={2} style={{ marginTop: 0, marginBottom: 20 }}>
          {error ? (
            <span style={{ color: 'red' }}>{t('error')}</span>
          ) : data ? (
            <span style={{ color: 'green' }}>{t('success')}</span>
          ) : (
            t('title')
          )}
        </Typography.Title>
        <Form
          form={form}
          name="basic"
          layout="vertical"
          style={{ width: '100%' }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item name="email">
            <Input type="email" placeholder="Enter your email" />
          </Form.Item>
          <Form.Item>
            <Button loading={loading} block htmlType="submit">
              {t('common:button.submit')}
            </Button>
          </Form.Item>
        </Form>
        <Link passHref href={Route.Login}>
          <Button style={{ padding: 0 }} type="ghost">
            {t('login')}
          </Button>
        </Link>
      </Card>
    </div>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  locale ??= 'en'
  return {
    props: {
      ...(await serverSideTranslations(locale, ['forgot-password', 'common'])),
    },
  }
}
