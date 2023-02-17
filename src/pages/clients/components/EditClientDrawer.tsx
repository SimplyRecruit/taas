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
      mask={false}
      footer={
        <Space>
          <Button type="primary" htmlType="submit">
            Save
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </Space>
      }
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
        requiredMark="optional"
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
                id: '',
                name: '',
                partnerName: '',
                startDate: new Date(),
              })
        }
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item
          required
          name="ID"
          label="ID"
          rules={[
            {
              validator: Client.validator('id'),
              message: 'Please enter a value',
            },
          ]}
        >
          <Input style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item
          required
          name="name"
          label="Name"
          rules={[
            {
              validator: Client.validator('name'),
              message: 'Please enter a value',
            },
          ]}
        >
          <Input style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item
          name="partnerName"
          label="Partner name"
          rules={[
            {
              validator: Client.validator('partnerName'),
            },
          ]}
        >
          <Input />
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
              getValueFromEvent={date => dateToMoment(date)}
              getValueProps={i => ({ value: moment(i) })}
            >
              <DatePicker
                allowClear={false}
                format={DEFAULT_DATE_FORMAT}
                style={{ width: '100%' }}
              />
            </Form.Item>
            <Form.Item
              rules={[
                {
                  required: true,
                  message: 'Please select a contract type',
                },
              ]}
              name="contractType"
              label="Contract type"
            >
              <Select
                options={Object.keys(ClientContractType).map(e => {
                  return { value: e, key: e }
                })}
              />
            </Form.Item>
            <Form.Item
              name="contractDate"
              label="Contract date"
              getValueFromEvent={date => dateToMoment(date)}
              getValueProps={i => i ?? { value: moment(i) }}
            >
              <DatePicker
                format={DEFAULT_DATE_FORMAT}
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Drawer>
  )
}

export default EditClientDrawer
