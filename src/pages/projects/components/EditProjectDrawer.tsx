import moment, { type Dayjs } from 'dayjs'
import { Input, Form, Drawer, Button, Space, DatePicker, Select } from 'antd'
import { Client, Project, ProjectCreateBody, ProjectUpdateBody } from 'models'
import { CloseOutlined } from '@ant-design/icons'
import { DEFAULT_DATE_FORMAT } from '@/constants'
import useApi from '@/services/useApi'
import { useEffect } from 'react'
import { ALL_UUID } from '~/common/Config'

interface RenderProps {
  open: boolean
  value?: Project
  onAdd: (newProject: Project) => void
  onUpdate: (updatedProject: Project) => void
  onError: () => void
  onCancel: () => void
}
export default function EditProjectDrawer({
  open,
  onAdd,
  value,
  onError,
  onUpdate,
  onCancel,
}: RenderProps) {
  const [form] = Form.useForm<ProjectCreateBody | ProjectUpdateBody>()
  const {
    call,
    data,
    loading: loadingGetAll,
    error,
  } = useApi('client', 'getAll', [])
  const { call: callCreate, loading: loadingCreate } = useApi(
    'project',
    'create'
  )
  const { call: callUpdate, loading: loadingUpdate } = useApi(
    'project',
    'update'
  )
  const loading = loadingUpdate || loadingCreate

  async function onSubmit() {
    form.validateFields().then(async body => {
      try {
        if (value) {
          await callUpdate(body as ProjectUpdateBody, { id: value.id })
          const client =
            body.clientId == ALL_UUID
              ? Client.createPartially({ id: ALL_UUID })
              : data?.find(e => e.id == body.clientId)
          onUpdate(
            Project.createPartially({
              id: value.id,
              active: value.active,
              ...body,
              client,
            })
          )
        } else {
          const id = await callCreate(body)
          const client =
            body.clientId == ALL_UUID
              ? Client.createPartially({ id: ALL_UUID })
              : data?.find(e => e.id == body.clientId)
          onAdd(Project.createPartially({ id, ...body, client, active: true }))
        }
      } catch {
        onError()
      }
    })
  }

  useEffect(() => {
    if (open) form.resetFields()
  }, [form, open])

  useEffect(() => {
    call({ entityStatus: 'active' })
  }, [])

  return (
    <Drawer
      title={value ? 'Edit Project' : 'Add Project'}
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
      <Form
        form={form}
        name="basic"
        requiredMark={false}
        layout="vertical"
        validateTrigger="onBlur"
        style={{ width: '100%' }}
        initialValues={
          value
            ? ProjectUpdateBody.create({
                abbr: value.abbr,
                name: value.name,
                clientId: value.client.id,
                active: value.active,
                startDate: value.startDate,
              })
            : ProjectCreateBody.createPartially({
                name: '',
                abbr: '',
                startDate: new Date(),
              })
        }
      >
        <Form.Item
          name="abbr"
          label="Abbreviation"
          rules={[
            {
              validator: Project.validator('abbr'),
              message: 'Please enter a value',
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="name"
          label="Name"
          rules={[
            {
              validator: Project.validator('name'),
              message: 'Please enter a value',
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          rules={[
            {
              required: true,
              message: 'Please select a client',
            },
          ]}
          name="clientId"
          label="Client"
        >
          <Select
            options={[
              { value: ALL_UUID, label: 'ALL' },
              ...data
                .map(e => ({
                  value: e.id,
                  label: `${e.abbr} - ${e.name}`,
                }))
                .sort((a, b) => a.label.localeCompare(b.label)),
            ]}
          />
        </Form.Item>
        <Form.Item
          name="startDate"
          label="Start date"
          getValueFromEvent={(date: Dayjs) => date.toDate()}
          getValueProps={i => ({ value: moment(i) })}
        >
          <DatePicker allowClear={false} format={DEFAULT_DATE_FORMAT} />
        </Form.Item>
      </Form>
    </Drawer>
  )
}
