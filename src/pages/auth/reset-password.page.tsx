import { Route } from '@/constants'
import useApi from '@/services/useApi'
import { Button, Form, Input, Typography } from 'antd'
import { ResetPasswordReqBody } from 'models'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { GetStaticProps } from 'next/types'

export default function ResetPasswordPage() {
  const { t } = useTranslation(['reset-password', 'common'])
  const router = useRouter()
  const { data, error, loading, call } = useApi('user', 'resetPassword')
  const { token, email, invitation } = router.query
  const [form] = Form.useForm()

  const onFinish = async ({ password }: { password: string }) => {
    if (typeof token === 'string' && typeof email === 'string') {
      try {
        const body = ResetPasswordReqBody.create({ password, token, email })
        await call(body)
        router.push(Route.Logout)
      } catch (e) {
        /* Invalid Credentials */
      }
    } else {
      /* Invalid Credentials */
    }
  }

  return (
    <>
      {typeof token === 'string' && (
        <>
          <Typography.Title
            level={3}
            style={{ marginTop: 0, marginBottom: 20 }}
          >
            {error ? (
              <span style={{ color: 'red' }}>{t('error')}</span>
            ) : data ? (
              <span style={{ color: 'green' }}>{t('success')}</span>
            ) : invitation == 'true' ? (
              t('invitation')
            ) : (
              t('reset')
            )}
          </Typography.Title>
          {!data ? (
            <Form
              form={form}
              name="basic"
              layout="vertical"
              style={{ width: '100%' }}
              onFinish={onFinish}
            >
              <Form.Item>
                <Input disabled value={email} />
              </Form.Item>
              <Form.Item
                name="password"
                rules={[
                  { validator: ResetPasswordReqBody.validator('password') },
                ]}
              >
                <Input.Password placeholder="Enter your password" />
              </Form.Item>
              <Form.Item>
                <Button
                  loading={loading}
                  block
                  htmlType="submit"
                  type="primary"
                >
                  {t('common:button.submit')}
                </Button>
              </Form.Item>
            </Form>
          ) : (
            <Typography.Text>
              Please wait while being redirected to the login page.
            </Typography.Text>
          )}
        </>
      )}
    </>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  locale ??= 'en'
  return {
    props: {
      ...(await serverSideTranslations(locale, ['reset-password', 'common'])),
    },
  }
}
