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
  Tabs,
  TabsProps,
  Radio,
  Table,
  Popover,
} from 'antd'
import { ResourceCreateBody, Client, ClientContractType } from 'models'
import {
  CloseOutlined,
  PlusCircleOutlined,
  DeleteOutlined,
} from '@ant-design/icons'
import { dateToMoment } from '@/util'
import { DEFAULT_ACTION_COLUMN_WIDTH, DEFAULT_DATE_FORMAT } from '@/constants'
import styles from './index.module.css'

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

  const onSubmit = () => {
    form.validateFields()
  }
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
  const onChange = (key: string) => {
    console.log(key)
  }

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: `Settings`,
      children: (
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
            <Col span={8}>
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
      ),
    },
    {
      key: '2',
      label: `Access`,
      children: (
        <div>
          <Form layout="vertical">
            <Form.Item label="Accessable by">
              <Radio.Group
                value={value}
                onChange={e => (onChange ? onChange(e.target.value) : null)}
              >
                <Radio>Everyone</Radio>
                <Radio>Custom</Radio>
              </Radio.Group>
            </Form.Item>
          </Form>

          <Popover
            showArrow={false}
            placement="bottomRight"
            content={
              <div>
                <p>Content</p>
                <p>Content</p>
              </div>
            }
          >
            <Button type="link" icon={<PlusCircleOutlined />}>
              Add new
            </Button>
          </Popover>
          <Table
            style={{ marginTop: 16 }}
            columns={[
              { title: 'Abbr', dataIndex: 'abbr', key: 'abbr' },
              { title: 'Name' },
              { title: 'Role' },
              { title: 'Hourly rate' },
              {
                title: '',
                width: DEFAULT_ACTION_COLUMN_WIDTH,
                render: () => {
                  return (
                    <Button
                      size="small"
                      type="text"
                      icon={<DeleteOutlined></DeleteOutlined>}
                    ></Button>
                  )
                },
              },
            ]}
            dataSource={[{ abbr: 'alo' }]}
          ></Table>
        </div>
      ),
    },
  ]
  return (
    <Drawer
      className={styles.wrapper}
      title={value ? 'Edit Client' : 'Add Client'}
      open={open}
      width={600}
      onClose={onClose}
      closable={false}
      mask={false}
      footer={
        <Space>
          <Button onClick={onSubmit} type="primary" htmlType="submit">
            Save
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </Space>
      }
      style={{ borderRadius: '16px', position: 'relative' }}
      extra={
        <Button
          onClick={onClose}
          size="small"
          type="text"
          icon={<CloseOutlined />}
        />
      }
    >
      <Tabs
        tabBarStyle={{ position: 'sticky', top: 0, zIndex: 10 }}
        type="card"
        defaultActiveKey="1"
        items={items}
        onChange={onChange}
      />
    </Drawer>
  )
}

export default EditClientDrawer
