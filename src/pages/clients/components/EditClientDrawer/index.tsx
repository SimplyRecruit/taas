import moment, { type Dayjs } from 'dayjs'
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
  Divider,
  RadioChangeEvent,
  Spin,
} from 'antd'
import { Client, ClientContractType, ClientUpdateBody, Resource } from 'models'
import {
  CloseOutlined,
  DeleteOutlined,
  PlusCircleOutlined,
} from '@ant-design/icons'
import { DEFAULT_ACTION_COLUMN_WIDTH, DEFAULT_DATE_FORMAT } from '@/constants'
import styles from './index.module.css'
import useApi from '@/services/useApi'
import { useEffect, useState } from 'react'
import ClientUpdateAccessBody from 'models/Client/req-bodies/ClientUpdateAccessBody'
import DropdownAutocomplete from '@/components/DropdownAutocomplete'
import { IoAddCircleOutline } from 'react-icons/io5'

interface RenderProps {
  open: boolean
  onUpdate: (updatedClient: Client) => void
  onError: () => void
  onActiveTabKeyChange: (tabKey: string) => void
  activeTabKey: string
  onCancel: () => void
  value: Client
}
const EditClientDrawer = ({
  open,
  onUpdate,
  onError,
  onActiveTabKeyChange,
  activeTabKey,
  onCancel,
  value,
}: RenderProps) => {
  const [settingsForm] = Form.useForm<ClientUpdateBody>()
  const [accessForm] = Form.useForm<ClientUpdateAccessBody>()
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

  const { call: updateAccess, loading: loadingUpdateAccess } = useApi(
    'client',
    'updateAccess'
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
    } catch {
      onError()
    }
  }

  async function onSubmitSettings() {
    settingsForm.validateFields().then(async e => {
      try {
        await callUpdate(e, { id: value.id })
        onUpdate({ ...value, ...e })
        onCancel()
      } catch {
        onError()
      }
    })
  }

  async function onToggleAccessStatus(e: RadioChangeEvent) {
    const everyoneHasAccess = e.target.value
    try {
      await updateAccess(ClientUpdateAccessBody.create({ everyoneHasAccess }), {
        clientId: value.id,
      })
      onUpdate({ ...value, everyoneHasAccess, resources: undefined })
    } catch (error) {
      onError()
    }
  }

  async function onAddResources() {
    accessForm.validateFields().then(async body => {
      try {
        await updateAccess(body, { clientId: value.id })
        const { everyoneHasAccess, userIds } = body
        const newResources = userIds
          ? resources?.filter(e => userIds!.includes(e.id))
          : undefined
        let merged: Resource[] | undefined = [
          ...(value.resources ?? []),
          ...(newResources ?? []),
        ]
        if (merged && merged.length == 0) merged = undefined
        onUpdate({ ...value, everyoneHasAccess: false, resources: merged })
      } catch {
        onError()
      }
    })
  }

  useEffect(() => {
    settingsForm.resetFields()
    accessForm.resetFields()
  }, [settingsForm, accessForm, value])

  useEffect(() => {
    callResourceGetAll({ entityStatus: 'active' })
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
                getValueFromEvent={(date: Dayjs) =>
                  date ? date.toDate() : null
                }
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
        <Spin spinning={loadingUpdateAccess}>
          <Form
            form={accessForm}
            layout="vertical"
            initialValues={{ everyoneHasAccess: value.everyoneHasAccess }}
          >
            <Form.Item name="everyoneHasAccess" label="Accessable by">
              <Radio.Group onChange={onToggleAccessStatus}>
                <Radio key="everyone" value={true}>
                  Everyone
                </Radio>
                <Radio key="custom" value={false}>
                  Custom
                </Radio>
              </Radio.Group>
            </Form.Item>
            <Divider />
            {internalEveryoneHasAccess === false && (
              <Form.Item name="userIds">
                <DropdownAutocomplete
                  onSave={onAddResources}
                  onReset={() => accessForm.setFieldValue('userIds', [])}
                  hasActionButtons
                  title="Members"
                  options={resources
                    .filter(e =>
                      value.resources
                        ? value.resources.findIndex(a => a.id == e.id) == -1
                        : true
                    )
                    .map(e => ({
                      value: e.id,
                      label: `${e.abbr} - ${e.name}`,
                    }))
                    .sort((a, b) => a.label.localeCompare(b.label))}
                >
                  <DropdownAutocomplete.Activator>
                    <Button
                      disabled={loadingGetResources}
                      style={{ padding: 0 }}
                      type="link"
                      icon={<PlusCircleOutlined />}
                    >
                      Add members
                    </Button>
                  </DropdownAutocomplete.Activator>
                </DropdownAutocomplete>
              </Form.Item>
            )}
          </Form>

          {internalEveryoneHasAccess === false && (
            <Table
              rowKey="id"
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
              pagination={false}
            />
          )}
        </Spin>
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
