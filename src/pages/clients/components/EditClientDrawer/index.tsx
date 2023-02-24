import moment from 'dayjs'
import {
  Input,
  Form,
  Row,
  Col,
  Drawer,
  Button,
  Space,
  DatePicker,
  Tabs,
  TabsProps,
  Radio,
  Table,
  Popover,
} from 'antd'
import { Client, ClientContractType, ClientUpdateBody } from 'models'
import {
  CloseOutlined,
  PlusCircleOutlined,
  DeleteOutlined,
} from '@ant-design/icons'
import { momentToDate } from '@/util'
import { DEFAULT_ACTION_COLUMN_WIDTH, DEFAULT_DATE_FORMAT } from '@/constants'
import styles from './index.module.css'
import useApi from '@/services/useApi'

interface RenderProps {
  open: boolean
  onUpdate: (updatedClient: Client) => void
  onActiveTabKeyChange: (tabKey: string) => void
  activeTabKey: string
  onCancel: () => void
  value: Client
}
const EditClientDrawer = ({
  open,
  onUpdate,
  onActiveTabKeyChange,
  activeTabKey,
  onCancel,
  value,
}: RenderProps) => {
  const [form] = Form.useForm<Client>()
  const { call: callUpdate, loading: loadingUpdate } = useApi(
    'client',
    'update'
  )

  const { call: callAddResource, loading: loadingAddResource } = useApi(
    'client',
    'addResource'
  )

  const { call: callRemoveResource, loading: loadingRemoveResource } = useApi(
    'client',
    'removeResource'
  )

  async function removeResource(id: string) {
    try {
      await callRemoveResource({ resourceId: id, clientId: value.id })
      const updated = { ...value }
      const index = updated.resources?.findIndex(e => e.id == id)
      if (index != undefined && updated.resources && index != -1) {
        console.log(index)
        updated.resources.splice(index, 1)
        onUpdate(updated)
      }
    } catch (error) {
      console.log(error)
    }
  }
  async function onSubmit() {
    form.validateFields().then(async e => {
      await callUpdate(e, { id: value.id })
      onUpdate({ ...value, ...e })
      onCancel()
    })
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
          initialValues={ClientUpdateBody.create({
            ...value,
          })}
        >
          <Form.Item
            required
            name="abbr"
            label="Abbreviation"
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
                getValueFromEvent={date => momentToDate(date)}
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
                <Radio.Group>
                  <Space size="middle" direction="vertical">
                    {Object.keys(ClientContractType).map(e => (
                      <Radio value={e} key={e}>
                        {e}
                      </Radio>
                    ))}
                  </Space>
                </Radio.Group>
              </Form.Item>
              <Form.Item
                name="contractDate"
                label="Contract date"
                getValueFromEvent={date => (date ? momentToDate(date) : null)}
                getValueProps={i => ({
                  value: i ? moment(i) : '',
                })}
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
          <Form
            layout="vertical"
            initialValues={{ everyoneHasAccess: value.everyoneHasAccess }}
          >
            <Form.Item label="Accessable by" name="everyoneHasAccess">
              <Radio.Group>
                <Radio key="everyone" value={true}>
                  Everyone
                </Radio>
                <Radio key="custom" value={false}>
                  Custom
                </Radio>
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
          <Button
            onClick={onSubmit}
            type="primary"
            htmlType="submit"
            loading={loadingUpdate}
          >
            Save
          </Button>
          <Table
            rowKey="abbr"
            style={{ marginTop: 16 }}
            columns={[
              { title: 'Abbr', dataIndex: 'abbr', key: 'abbr' },
              { title: 'Name', dataIndex: 'name', key: 'name' },
              { title: 'Role', dataIndex: 'role', key: 'role' },
              {
                title: 'Hourly rate',
                dataIndex: 'hourlyRate',
                key: 'hourlyRate',
              },
              {
                title: '',
                width: DEFAULT_ACTION_COLUMN_WIDTH,
                render: (record: Client) => {
                  return (
                    <Button
                      onClick={() => removeResource(record.id)}
                      size="small"
                      type="text"
                      icon={<DeleteOutlined></DeleteOutlined>}
                    />
                  )
                },
              },
            ]}
            dataSource={value.resources}
          />
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
      onClose={onCancel}
      closable={false}
      mask={false}
      footer={
        <Space>
          <Button
            onClick={onSubmit}
            type="primary"
            htmlType="submit"
            loading={loadingUpdate}
          >
            Save
          </Button>
          <Button onClick={onCancel}>Cancel</Button>
        </Space>
      }
      style={{ borderRadius: '16px', position: 'relative' }}
      extra={
        <Button
          onClick={onCancel}
          size="small"
          type="text"
          icon={<CloseOutlined />}
        />
      }
    >
      <Tabs
        tabBarStyle={{ position: 'sticky', top: 0, zIndex: 10 }}
        type="card"
        activeKey={activeTabKey}
        items={items}
        onChange={onActiveTabKeyChange}
      />
    </Drawer>
  )
}

export default EditClientDrawer
