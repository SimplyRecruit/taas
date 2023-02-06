import useApi from '@/services/useApi'
import { Button, Card, Form, Input, Typography } from 'antd'
import LoginReqBody from 'models/User/LoginReqBody'
import Link from 'next/link'

const LoginPage = () => {
  const { data, error, loading, call } = useApi('user', 'login')
  const [form] = Form.useForm()
  const onFinish = (values: LoginReqBody) => {
    console.log('Success:', values)
    call(values)
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
      {loading && <h1>Loading...</h1>}
      {!!error && <h1>{error.message}</h1>}
      {!!data && <h1>{JSON.stringify(data)}</h1>}

      <Card className="elevation" style={{ width: '100%', maxWidth: 300 }}>
        <Typography.Title level={2} style={{ marginTop: 0, marginBottom: 20 }}>
          Log In
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
            <Button block htmlType="submit">
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

export default LoginPage
