import { Route } from '@/constants'
import cookieKeys from '@/constants/cookie-keys'
import useApi from '@/services/useApi'
import { Button, Card, Form, Input, Typography } from 'antd'
import { LoginReqBody } from 'models'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import Cookies from 'universal-cookie'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { GetStaticProps } from 'next/types'

export default function LoginPage() {
  const { t } = useTranslation(['login', 'common'])
  const router = useRouter()
  const { data, error, loading, call } = useApi('user', 'login')
  const [form] = Form.useForm()
  const changeLocale = (locale: string) => {
    new Cookies().set('NEXT_LOCALE', locale, { path: '/' })
    router.push(
      { pathname: router.pathname, query: router.query },
      router.asPath,
      { locale }
    )
  }

  const onFinish = async (values: LoginReqBody) => {
    console.log('Success:', values)
    try {
      const token = await call(values)
      new Cookies().set(cookieKeys.COOKIE_USER_TOKEN, token, { path: '/' })
      await router.replace(Route.TimeTrack)
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
        <Typography.Title level={3} style={{ marginTop: 0, marginBottom: 20 }}>
          {error ? (
            <span style={{ color: 'red' }}>{t('invalidCredentials')}</span>
          ) : data ? (
            <span style={{ color: 'green' }}>{t('redirecting')}</span>
          ) : (
            t('title')
          )}
        </Typography.Title>
        <Form
          form={form}
          name="basic"
          layout="vertical"
          style={{ width: '100%' }}
          initialValues={LoginReqBody.create({ email: '', password: '' })}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item
            name="email"
            rules={[{ validator: LoginReqBody.validator('email') }]}
          >
            <Input type="email" placeholder="Enter your email" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ validator: LoginReqBody.validator('password') }]}
          >
            <Input.Password placeholder="Enter your password" />
          </Form.Item>
          <Form.Item>
            <Button loading={loading || !!data} block htmlType="submit">
              {t('common:button.submit')}
            </Button>
          </Form.Item>
          <Link passHref href={Route.ForgotPassword}>
            <Button style={{ padding: 0 }} type="ghost">
              {t('forgotPassword')}
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
      ...(await serverSideTranslations(locale, ['login', 'common'])),
    },
  }
}
