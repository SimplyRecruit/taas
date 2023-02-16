import UserRoleSelector from '@/pages/team/components/UserRoleSelector'
import moment from 'dayjs'
import {
  InputNumber,
  Input,
  Form,
  Row,
  Col,
  Drawer,
  Button,
  Space,
  DatePicker,
  Switch,
} from 'antd'
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
  onUpdate: (updatedMember: Resource) => void
  onCancel: () => void
  value: Resource | null
}
const InviteMemberModal = ({
  open,
  onAdd,
  onUpdate,
  onCancel,
  value,
}: RenderProps) => {
  const [form] = Form.useForm()
  const { loading: loadingCreate, call: callCreate } = useApi(
    'user',
    'inviteMember'
  )
  const { loading: loadingUpdate, call: callUpdate } = useApi(
    'resource',
    'update'
  )
  const loading = () => loadingCreate || loadingUpdate

  const onFinish = async (member: Resource) => {
    try {
      if (value) {
        const { email, ...updatedMember } = member
        await callUpdate(updatedMember as ResourceUpdateBody, { id: value.id })
        onUpdate({ ...member, id: value.id })
      } else {
        const id: string = await callCreate(member as ResourceCreateBody)
        onAdd({ ...member, id, active: true })
        form.resetFields()
      }
    } catch (error) {
      console.log(error)
    }
  }

  const onFinishFailed = (errorInfo: unknown) => {
    console.log('Failed:', errorInfo)
  }

  const onClose = () => {
    onCancel()
    form.resetFields()
  }
  return (
    <Drawer
      title="Invite Member"
      open={open}
      onClose={onClose}
      closable={false}
      style={{ borderRadius: '16px' }}
      extra={
        <Button
          onClick={onClose}
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
          value
            ? Resource.create({
                ...value,
              })
            : Resource.createPartially({
                startDate: new Date(),
                name: '',
                email: '',
                hourlyRate: 0,
                role: UserRole.END_USER,
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
          <Input disabled={!!value} />
        </Form.Item>
        <Row>
          <Col span={12}>
            <Form.Item name="role" label="Role">
              <UserRoleSelector />
            </Form.Item>
          </Col>
          <Col span={2} />
          <Col span={10}>
            <Form.Item
              name="hourlyRate"
              label="Hourly rate"
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
        </Row>
        <Row>
          <Col span={12}>
            <Form.Item
              name="startDate"
              label="Start date"
              rules={[
                {
                  required: true,
                  message: 'Please select a start date',
                },
              ]}
              getValueFromEvent={date => moment(date).format('YYYY-MM-DD')}
              getValueProps={i => ({ value: moment(i) })}
            >
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={2} />
          <Col>
            {!!value && (
              <Form.Item valuePropName="checked" name="active" label="Active">
                <Switch />
              </Form.Item>
            )}
          </Col>
        </Row>
        <Space>
          <Button type="primary" htmlType="submit" loading={loading()}>
            Save
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </Space>
      </Form>
    </Drawer>
  )
}

export default InviteMemberModal
