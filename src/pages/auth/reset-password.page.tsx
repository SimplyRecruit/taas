import { Route } from '@/constants'
import cookieKeys from '@/constants/cookie-keys'
import useApi from '@/services/useApi'
import { Button, Card, Form, Input, Typography } from 'antd'
import { ResetPasswordReqBody } from 'models'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import Cookies from 'universal-cookie'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { GetStaticProps } from 'next/types'

export default function ResetPasswordPage() {
  const { t } = useTranslation('resetPassword')
  const router = useRouter()
  const { data, error, loading, call } = useApi('user', 'resetPassword')
  const [form] = Form.useForm()
  const changeLocale = (locale: string) => {
    new Cookies().set('NEXT_LOCALE', locale, { path: '/' })
    router.push(
      { pathname: router.pathname, query: router.query },
      router.asPath,
      { locale }
    )
  }

  const onFinish = async ({ password }: { password: string }) => {
    const { token, email } = router.query
    if (typeof token === 'string' && typeof email === 'string') {
      try {
        const body = ResetPasswordReqBody.create({ password, token, email })
        console.log(body)
        await call(body)
      } catch (e) {
        /* Invalid Credentials */
      }
    } else {
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
            <span style={{ color: 'red' }}>{t('invalidCredentials')}</span>
          ) : data ? (
            <span style={{ color: 'green' }}>{t('resetSuccessful')}</span>
          ) : (
            t('logIn')
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
          <Form.Item
            name="password"
            rules={[{ validator: ResetPasswordReqBody.validator('password') }]}
          >
            <Input.Password placeholder="Enter your password" />
          </Form.Item>
          <Form.Item>
            <Button loading={loading} block htmlType="submit">
              Submit
            </Button>
          </Form.Item>
          <Link passHref href="/forgot-password">
            <Button style={{ padding: 0 }} type="ghost">
              Forgot password?
            </Button>
          </Link>
        </Form>
      </Card>
    </div>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  locale ??= 'en'
  return {
    props: {
      ...(await serverSideTranslations(locale, ['login'])),
    },
  }
}
