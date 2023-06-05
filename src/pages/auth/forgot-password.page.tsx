import useApi from '@/services/useApi'
import { Button, Form, Input, Typography } from 'antd'
import Link from 'next/link'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { GetStaticProps } from 'next/types'
import { Route } from '@/constants'
import { AxiosError } from 'axios'

export default function ForgotPasswordPage() {
  const { t } = useTranslation(['forgot-password', 'common'])
  const { data, error, loading, call } = useApi('user', 'forgotPassword')
  const [form] = Form.useForm()

  const onFinish = async ({ email }: { email: string }) => {
    try {
      await call({ email })
    } catch (e) {
      /* Invalid Credentials */
    }
  }

  return (
    <>
      <Typography.Title level={3} style={{ marginTop: 0, marginBottom: 20 }}>
        {error ? (
          <span style={{ color: 'red' }}>{errorText(error)}</span>
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
      >
        <Form.Item name="email">
          <Input type="email" placeholder="Enter your email" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" loading={loading} block htmlType="submit">
            {t('common:button.submit')}
          </Button>
        </Form.Item>
      </Form>
      <Link passHref href={Route.Login}>
        <Button style={{ padding: 0 }} type="ghost">
          {t('login')}
        </Button>
      </Link>
    </>
  )

  function errorText(error: AxiosError) {
    switch (error.response?.status) {
      case 403:
        return t('error-403')
      case 404:
        return t('error-404')
      default:
        return t('error-500')
    }
  }
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  locale ??= 'en'
  return {
    props: {
      ...(await serverSideTranslations(locale, ['forgot-password', 'common'])),
    },
  }
}
