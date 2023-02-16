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
  Select,
} from 'antd'
import { ResourceCreateBody, Client, ClientContractType } from 'models'
import { CloseOutlined } from '@ant-design/icons'
import { dateToMoment } from '@/util'
import { DEFAULT_DATE_FORMAT } from '@/constants'

interface RenderProps {
  open: boolean
  onAdd: (newMember: Client) => void
  onUpdate: (updatedMember: Client) => void
  onCancel: () => void
  value: Client | null
}
const EditClientDrawer = ({
  open,
  onAdd,
  onUpdate,
  onCancel,
  value,
}: RenderProps) => {
  const [form] = Form.useForm()

  const onFinish = async (client: Client) => {
    console.log(client)
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
      title={value ? 'Edit Client' : 'Add Client'}
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
            ? Client.create({
                ...value,
              })
            : Client.createPartially({
                startDate: new Date(),
                name: '',
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
            <Form.Item name="contractType" label="Contract type">
              <Select
                options={Object.keys(ClientContractType).map(e => {
                  return { value: e, key: e }
                })}
              />
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
              getValueFromEvent={date => dateToMoment(date)}
              getValueProps={i => ({ value: moment(i) })}
            >
              <DatePicker
                format={DEFAULT_DATE_FORMAT}
                style={{ width: '100%' }}
              />
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
          <Button type="primary" htmlType="submit">
            Save
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </Space>
      </Form>
    </Drawer>
  )
}

export default EditClientDrawer
