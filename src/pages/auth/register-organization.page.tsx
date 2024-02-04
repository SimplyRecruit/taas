import useApi from '@/services/useApi'
import { Button, Form, Input, Typography } from 'antd'
import { RegisterOrganizationReqBody } from 'models'

export default function RegisterOrganizationPage() {
  const { data, error, loading, call } = useApi('user', 'registerOrganization')
  const [form] = Form.useForm()

  const onFinish = async (values: RegisterOrganizationReqBody) => {
    console.log('Success:', values)
    try {
      await call(values)
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
          <span style={{ color: 'red' }}>Error</span>
        ) : data ? (
          <span style={{ color: 'green' }}>OK</span>
        ) : (
          'Register Organization'
        )}
      </Typography.Title>
      <Form
        form={form}
        name="basic"
        layout="vertical"
        style={{ width: '100%' }}
        initialValues={RegisterOrganizationReqBody.create({
          email: '',
          adminName: '',
          organizationName: '',
          adminAbbr: '',
        })}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item
          name="email"
          rules={[
            { validator: RegisterOrganizationReqBody.validator('email') },
          ]}
        >
          <Input type="email" placeholder="Email" />
        </Form.Item>
        <Form.Item
          name="adminName"
          rules={[
            { validator: RegisterOrganizationReqBody.validator('adminName') },
          ]}
        >
          <Input placeholder="Admin Name" />
        </Form.Item>
        <Form.Item
          name="adminAbbr"
          rules={[
            { validator: RegisterOrganizationReqBody.validator('adminAbbr') },
          ]}
        >
          <Input placeholder="Admin Abbreviation" />
        </Form.Item>
        <Form.Item
          name="organizationName"
          rules={[
            {
              validator:
                RegisterOrganizationReqBody.validator('organizationName'),
            },
          ]}
        >
          <Input placeholder="Organization Name" />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            loading={loading || !!data}
            block
            htmlType="submit"
          >
            Submit
          </Button>
        </Form.Item>
      </Form>
    </>
  )
}
