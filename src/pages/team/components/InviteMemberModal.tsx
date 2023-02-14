import UserRoleSelector from '@/pages/team/components/UserRoleSelector'
import { Modal, InputNumber, Input, Form, Row, Col } from 'antd'
import { InviteMemberReqBody, UserRole } from 'models'
interface RenderProps {
  open: boolean
  onAdd: (newMember: InviteMemberReqBody) => void
  onCancel: () => void
}
const InviteMemberModal = ({ open, onAdd, onCancel }: RenderProps) => {
  const onOk = () => {
    form
      .validateFields()
      .then(values => {
        form.resetFields()
        onAdd(values)
      })
      .catch(info => {
        console.log('Validate Failed:', info)
      })
  }
  const [form] = Form.useForm()

  const onFinish = () => {
    return null
  }

  const onFinishFailed = (errorInfo: unknown) => {
    console.log('Failed:', errorInfo)
  }
  return (
    <Modal title="Invite Member" open={open} onOk={onOk} onCancel={onCancel}>
      <Form
        form={form}
        name="basic"
        layout="vertical"
        validateTrigger="onBlur"
        style={{ width: '100%' }}
        initialValues={InviteMemberReqBody.createPartially({
          name: 'deneme',
          email: 'test',
          hourlyRate: 10,
          role: UserRole.ADMIN,
        })}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item
          name="name"
          label="Name"
          rules={[
            {
              validator: InviteMemberReqBody.validator('name'),
              message: 'Please enter a value',
            },
          ]}
        >
          <Input placeholder="Name" style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item
          required
          name="email"
          label="E-mail"
          rules={[
            {
              validator: InviteMemberReqBody.validator('email'),
              message: 'Please enter a valid e-mail address',
            },
          ]}
        >
          <Input type="email" placeholder="Enter e-mail" />
        </Form.Item>
        <Row>
          <Col span={12}>
            <Form.Item
              name="hourlyRate"
              label="Hourly Rate"
              rules={[
                {
                  required: true,
                  message: 'Please enter a value',
                },
              ]}
            >
              <InputNumber
                type="number"
                min={0}
                max={32767}
                placeholder="Hourly Rate"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              required
              name="role"
              label="Role"
              style={{ maxWidth: 150 }}
            >
              <UserRoleSelector />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  )
}

export default InviteMemberModal
