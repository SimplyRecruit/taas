import { Route } from '@/constants'
import cookieKeys from '@/constants/cookie-keys'
import useApi from '@/services/useApi'
import { Button, Card, Form, Input, Typography } from 'antd'
import LoginReqBody from 'models/User/LoginReqBody'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Cookies from 'universal-cookie'

export default function LoginPage() {
  const router = useRouter()
  const { data, error, loading, call } = useApi('user', 'login')
  const [form] = Form.useForm()

  const onFinish = async (values: LoginReqBody) => {
    console.log('Success:', values)
    try {
      const token: string = await call(values)
      new Cookies().set(cookieKeys.COOKIE_USER_TOKEN, token)
      await router.replace(Route.DashBoard)
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
      <Card className="elevation" style={{ width: '100%', maxWidth: 300 }}>
        <Typography.Title level={2} style={{ marginTop: 0, marginBottom: 20 }}>
          {error ? (
            <span style={{ color: 'red' }}>Invalid Credentials</span>
          ) : data ? (
            <span style={{ color: 'green' }}>Redirecting...</span>
          ) : (
            'Log In'
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
