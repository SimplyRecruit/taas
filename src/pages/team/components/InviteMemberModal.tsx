import UserRoleSelector from '@/pages/team/components/UserRoleSelector'
import { InputNumber, Input, Form, Row, Col, Drawer, Button, Space } from 'antd'
import {
  ResourceCreateBody,
  Resource,
  UserRole,
  ResourceUpdateBody,
} from 'models'
import { CloseOutlined } from '@ant-design/icons'
import useApi from '@/services/useApi'

interface RenderProps {
  open: boolean
  onAdd: (newMember: Resource) => void
  onCancel: () => void
  value?: Resource
}
const InviteMemberModal = ({ open, onAdd, onCancel, value }: RenderProps) => {
  const [form] = Form.useForm()
  const {
    data: dataCreate,
    loading: loadingCreate,
    error: errorCreate,
    call: callCreate,
  } = useApi('user', 'inviteMember')
  const {
    data: dataUpdate,
    loading: loadingUpdate,
    error: errorUpdate,
    call: callUpdate,
  } = useApi('resource', 'update')

  const onFinish = async (member: Resource) => {
    try {
      if (value) {
        callUpdate(member as ResourceUpdateBody, { id: member.id })
      } else {
        const id: string = await callCreate(member as ResourceCreateBody)
        onAdd({ ...member, id })
      }
    } catch (error) {
      console.log(error)
    }
  }
  const loading = () => loadingCreate || loadingUpdate
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
        initialValues={
          value ??
          Resource.createPartially({
            active: true,
            startDate: new Date(),
            name: '',
            email: '',
            hourlyRate: 0,
            role: UserRole.ADMIN,
          })
        }
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item
          name="name"
          label="Name"
          rules={[
            {
              validator: ResourceCreateBody.validator('name'),
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
              validator: ResourceCreateBody.validator('email'),
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
                  validator: ResourceCreateBody.validator('hourlyRate'),
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
          <Button type="primary" htmlType="submit" loading={loading()}>
            Save
          </Button>
          <Button onClick={onCancel}>Cancel</Button>
        </Space>
      </Form>
    </Drawer>
  )
}

export default InviteMemberModal
