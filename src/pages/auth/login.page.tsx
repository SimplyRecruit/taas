import { Route } from '@/constants'
import cookieKeys from '@/constants/cookie-keys'
import useApi from '@/services/useApi'
import { Button, Form, Input, Typography } from 'antd'
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

  const onFinish = async (values: LoginReqBody) => {
    console.log('Success:', values)
    try {
      const token = await call(values)
      new Cookies().set(cookieKeys.COOKIE_USER_TOKEN, token, { path: '/' })
      await router.replace(Route.TimeTracker)
    } catch (e) {
      /* Invalid Credentials */
    }
  }

  const onFinishFailed = (errorInfo: unknown) => {
    console.log('Failed:', errorInfo)
  }

  return (
    <>
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
          <Input type="email" placeholder={t('emailPlaceholder') ?? ''} />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ validator: LoginReqBody.validator('password') }]}
        >
          <Input.Password placeholder={t('passwordPlaceholder') ?? ''} />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            loading={loading || !!data}
            block
            htmlType="submit"
          >
            {t('common:button.submit')}
          </Button>
        </Form.Item>
        <Link passHref href={Route.ForgotPassword}>
          <Button style={{ padding: 0 }} type="ghost">
            {t('forgotPassword')}
          </Button>
        </Link>
      </Form>
    </>
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
