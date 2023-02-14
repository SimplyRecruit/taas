import UserRoleSelector from '@/pages/team/components/UserRoleSelector'
import {
  Modal,
  InputNumber,
  Input,
  Form,
  Row,
  Col,
  Drawer,
  Button,
  Space,
} from 'antd'
import { InviteMemberReqBody, UserRole } from 'models'
import { CloseOutlined } from '@ant-design/icons'
interface RenderProps {
  open: boolean
  onAdd: (newMember: InviteMemberReqBody) => void
  onCancel: () => void
}
const InviteMemberModal = ({ open, onAdd, onCancel }: RenderProps) => {
  const [form] = Form.useForm()

  const onFinish = (newMember: InviteMemberReqBody) => {
    // try API catch
    onAdd(newMember)

    form.resetFields()
  }

  const onFinishFailed = (errorInfo: unknown) => {
    console.log('Failed:', errorInfo)
  }
  return (
    <Drawer
      title="Invite Member"
      open={open}
      onClose={onCancel}
      closable={false}
      style={{ borderRadius: '16px' }}
      extra={
        <Button
          onClick={onCancel}
          size="small"
          type="text"
          icon={<CloseOutlined />}
        />
      }
    >
      <Form
        form={form}
        requiredMark={false}
        name="basic"
        layout="vertical"
        validateTrigger="onBlur"
        style={{ width: '100%' }}
        initialValues={InviteMemberReqBody.create({
          name: '',
          email: '',
          hourlyRate: 0,
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
          <Input style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item
          name="email"
          label="E-mail"
          rules={[
            {
              validator: InviteMemberReqBody.validator('email'),
              message: 'Please enter a valid e-mail address',
            },
          ]}
        >
          <Input />
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
                  validator: InviteMemberReqBody.validator('hourlyRate'),
                },
              ]}
            >
              <InputNumber
                style={{ width: '16ch' }}
                type="number"
                placeholder="Enter rate"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="role" label="Role">
              <UserRoleSelector />
            </Form.Item>
          </Col>
        </Row>
        <Space>
          <Button type="primary" htmlType="submit">
            Save
          </Button>
          <Button>Cancel</Button>
        </Space>
      </Form>
    </Drawer>
  )
}

export default InviteMemberModal
