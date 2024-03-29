import UserRoleSelector from '@/pages/team/components/UserRoleSelector'
import moment, { type Dayjs } from 'dayjs'
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
} from 'antd'
import {
  ResourceCreateBody,
  Resource,
  UserRole,
  ResourceUpdateBody,
} from 'models'
import { CloseOutlined } from '@ant-design/icons'
import useApi from '@/services/useApi'
import { DEFAULT_DATE_FORMAT } from '@/constants'
import { useEffect } from 'react'

interface RenderProps {
  open: boolean
  onAdd: (newMember: Resource) => void
  onUpdate: (updatedMember: Resource) => void
  onError: () => void
  onCancel: () => void
  value: Resource | null
}
const EditMemberDrawer = ({
  open,
  onAdd,
  onUpdate,
  onError,
  onCancel,
  value,
}: RenderProps) => {
  const [form] = Form.useForm<Resource>()
  const { loading: loadingCreate, call: callCreate } = useApi(
    'user',
    'inviteMember'
  )
  const { loading: loadingUpdate, call: callUpdate } = useApi(
    'resource',
    'update'
  )
  const loading = loadingCreate || loadingUpdate

  const onSubmit = () => {
    form.validateFields().then(member => onFinish(member))
  }

  const onFinish = async (member: Resource) => {
    try {
      if (value) {
        const { email, ...updatedMember } = member
        await callUpdate(updatedMember as ResourceUpdateBody, { id: value.id })
        onUpdate({ ...member, active: value.active, id: value.id })
      } else {
        const id: string = await callCreate(member as ResourceCreateBody)
        onAdd({ ...member, id, active: true })
      }
    } catch {
      onError()
    }
  }

  useEffect(() => {
    if (open) form.resetFields()
  }, [form, open])

  return (
    <Drawer
      title={value ? 'Edit Member' : 'Invite Member'}
      open={open}
      onClose={onCancel}
      closable={false}
      mask={false}
      footer={
        <Space>
          <Button
            onClick={onSubmit}
            type="primary"
            htmlType="submit"
            loading={loading}
          >
            Save
          </Button>
          <Button onClick={onCancel}>Cancel</Button>
        </Space>
      }
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
          value
            ? Resource.create({
                ...value,
              })
            : Resource.createPartially({
                startDate: new Date(),
                name: '',
                abbr: '',
                email: '',
                hourlyRate: 0,
                role: UserRole.END_USER,
              })
        }
      >
        <Form.Item
          name="abbr"
          label="Abbreviation"
          rules={[
            {
              validator: ResourceCreateBody.validator('abbr'),
              message: 'Please enter a value',
            },
          ]}
        >
          <Input style={{ width: '100%' }} />
        </Form.Item>
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
        <Form.Item name="role" label="Role">
          <UserRoleSelector />
        </Form.Item>
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
              getValueFromEvent={(date: Dayjs) => date.toDate()}
              getValueProps={i => ({ value: moment(i) })}
            >
              <DatePicker
                allowClear={false}
                format={DEFAULT_DATE_FORMAT}
                style={{ width: '100%' }}
              />
            </Form.Item>
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
      </Form>
    </Drawer>
  )
}

export default EditMemberDrawer
