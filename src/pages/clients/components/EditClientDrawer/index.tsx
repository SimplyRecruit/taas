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
  Select,
  Divider,
} from 'antd'
import { Client, ClientContractType, ClientUpdateBody, Resource } from 'models'
import { CloseOutlined, DeleteOutlined } from '@ant-design/icons'
import { momentToDate } from '@/util'
import { DEFAULT_ACTION_COLUMN_WIDTH, DEFAULT_DATE_FORMAT } from '@/constants'
import styles from './index.module.css'
import useApi from '@/services/useApi'
import { useEffect } from 'react'
import ClientAddResourceBody from 'models/Client/req-bodies/ClientAddResourceBody'

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
  const [settingsForm] = Form.useForm<ClientUpdateBody>()
  const [accessForm] = Form.useForm<ClientAddResourceBody>()
  const internalEveryoneHasAccess = Form.useWatch(
    'everyoneHasAccess',
    accessForm
  )
  const {
    data: resources,
    loading: loadingGetResources,
    error,
    call: callResourceGetAll,
  } = useApi('resource', 'getAll', [])
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
      await callRemoveResource({ userId: id, clientId: value.id })
      const resources = value.resources
      const index = resources?.findIndex(e => e.id == id)
      if (index != undefined && resources && index != -1) {
        resources.splice(index, 1)
        onUpdate({ ...value, resources: [...resources] })
      }
    } catch (error) {
      console.log(error)
    }
  }

  async function onSubmitSettings() {
    settingsForm.validateFields().then(async e => {
      await callUpdate(e, { id: value.id })
      onUpdate({ ...value, ...e })
      onCancel()
    })
  }

  async function onSubmitAccess() {
    accessForm.validateFields().then(async body => {
      if (body.everyoneHasAccess) delete body.userIds
      await callAddResource(body, { clientId: value.id })
      const { everyoneHasAccess, userIds } = body
      const newResources = userIds
        ? resources?.filter(e => userIds!.includes(e.id))
        : undefined
      let merged: Resource[] | undefined = everyoneHasAccess
        ? undefined
        : [...(value.resources ?? []), ...(newResources ?? [])]
      if (merged && merged.length == 0) merged = undefined
      onUpdate({ ...value, everyoneHasAccess, resources: merged })
    })
  }

  useEffect(() => {
    settingsForm.resetFields()
    accessForm.resetFields()
  }, [settingsForm, accessForm, value])

  useEffect(() => {
    callResourceGetAll()
  }, [])

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: `Settings`,
      children: (
        <Form
          form={settingsForm}
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
            form={accessForm}
            layout="vertical"
            initialValues={{ everyoneHasAccess: value.everyoneHasAccess }}
          >
            <Form.Item name="everyoneHasAccess" label="Accessable by">
              <Radio.Group>
                <Radio key="everyone" value={true}>
                  Everyone
                </Radio>
                <Radio key="custom" value={false}>
                  Custom
                </Radio>
              </Radio.Group>
            </Form.Item>
            {internalEveryoneHasAccess === false && !loadingGetResources && (
              <Form.Item name="userIds">
                <Select
                  placement="topRight"
                  filterOption={(inputValue, option) =>
                    option?.label
                      .toLocaleLowerCase()
                      .includes(inputValue.toLocaleLowerCase()) ?? false
                  }
                  mode="multiple"
                  allowClear
                  style={{ width: '100%' }}
                  placeholder="Please select"
                  options={resources
                    .filter(e =>
                      value.resources
                        ? value.resources.findIndex(a => a.id == e.id) == -1
                        : true
                    )
                    .map(e => ({
                      value: e.id,
                      label: `${e.abbr} - ${e.name}`,
                    }))}
                  dropdownRender={menu => <>{menu}</>}
                />
              </Form.Item>
            )}
          </Form>
          <Divider style={{ margin: '8px 0' }} />
          <Button
            onClick={onSubmitAccess}
            type="primary"
            htmlType="submit"
            loading={loadingAddResource}
          >
            Save
          </Button>
          {internalEveryoneHasAccess === false && (
            <Table
              rowKey="id"
              style={{ marginTop: 16 }}
              scroll={{ y: 240 }}
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
                        loading={loadingRemoveResource}
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
          )}
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
        activeTabKey == '1' && (
          <Space>
            <Button
              onClick={onSubmitSettings}
              type="primary"
              htmlType="submit"
              loading={loadingUpdate}
            >
              Save
            </Button>
            <Button onClick={onCancel}>Cancel</Button>
          </Space>
        )
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
