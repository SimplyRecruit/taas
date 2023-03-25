import moment from 'dayjs'
import {
  Input,
  Form,
  Drawer,
  Button,
  Space,
  DatePicker,
  Select,
  Checkbox,
  InputNumber,
} from 'antd'
import {
  ClientRelation,
  ProjectRelation,
  TimelessDate,
  TT,
  TTUpdateBody,
} from 'models'
import { CloseOutlined } from '@ant-design/icons'
import { DEFAULT_DATE_FORMAT } from '@/constants'
import { useEffect } from 'react'
import useApi from '@/services/useApi'

interface RenderProps {
  projectOptions?: ProjectRelation[]
  clientOptions?: ClientRelation[]
  open: boolean
  value?: TT
  onUpdate: (updatedProject: TT) => void
  onError: () => void
  onCancel: () => void
}
export default function EditProjectDrawer({
  projectOptions,
  clientOptions,
  open,
  value,
  onError,
  onUpdate,
  onCancel,
}: RenderProps) {
  const [form] = Form.useForm<TTUpdateBody>()
  const { call, loading } = useApi('timeTrack', 'update')

  async function onSubmit() {
    form.validateFields().then(async ({ date, ...rest }) => {
      try {
        console.log('click')
        if (value) {
          await call({ date, ...rest }, { id: value.id })
          onUpdate(TT.create({ id: value.id, date: date.dateObject, ...rest }))
        } else {
          console.log('this should not happen')
        }
      } catch {
        onError()
      }
    })
  }

  useEffect(() => {
    if (open) form.resetFields()
  }, [form, open])

  return (
    <Drawer
      title="Edit Timetrack"
      open={open}
      onClose={() => {
        if (!loading) onCancel()
      }}
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
          <Button onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
        </Space>
      }
      style={{ borderRadius: '16px', position: 'relative' }}
      extra={
        <Button
          disabled={loading}
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
        initialValues={TTUpdateBody.createPartially({
          ...value,
          date: TimelessDate.fromDate(
            value ? new Date(value?.date) : new Date()
          ),
        })}
      >
        <Form.Item
          name="date"
          label="Date"
          getValueFromEvent={dayjs => TimelessDate.fromDate(dayjs.toDate())}
          getValueProps={(date: TimelessDate) => ({
            value: moment(date.dateObject),
          })}
        >
          <DatePicker
            onChange={e => {
              if (e) console.log(TimelessDate.fromDate(e.toDate()))
            }}
            allowClear={false}
            format={DEFAULT_DATE_FORMAT}
          />
        </Form.Item>
        <Form.Item
          rules={[
            {
              required: true,
              message: 'Please select a client',
            },
          ]}
          name="clientAbbr"
          label="Client"
        >
          <Select
            placeholder="Select a client"
            options={clientOptions?.map(e => ({
              value: e.abbr,
              label: `${e.abbr} - ${e.name}`,
            }))}
          />
        </Form.Item>
        <Form.Item
          name="hour"
          label="Hour"
          rules={[
            {
              validator: TT.validator('hour'),
              required: true,
              message: 'Please enter a positive value',
            },
          ]}
        >
          <InputNumber
            style={{ width: '12ch' }}
            type="number"
            placeholder="Hours"
          />
        </Form.Item>
        <Form.Item
          name="description"
          label="Description"
          rules={[
            {
              validator: TT.validator('description'),
              message: 'Please enter a value',
            },
          ]}
        >
          <Input placeholder="Description" />
        </Form.Item>
        <Form.Item valuePropName="checked" name="billable" label="Billable">
          <Checkbox />
        </Form.Item>
        <Form.Item
          name="ticketNo"
          label="Ticket no"
          rules={[
            {
              validator: TT.validator('ticketNo'),
              message: 'Max length is 255',
            },
          ]}
        >
          <Input placeholder="Ticket no (optional)" />
        </Form.Item>
        <Form.Item
          name="projectAbbr"
          label="Project"
          rules={[
            {
              required: true,
              message: 'Please select a project',
            },
          ]}
        >
          <Select
            placeholder="Select a project"
            options={projectOptions?.map(e => ({
              value: e.abbr,
              label: `${e.abbr} - ${e.name}`,
            }))}
          />
        </Form.Item>
      </Form>
    </Drawer>
  )
}
