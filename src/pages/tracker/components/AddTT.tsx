import moment from 'dayjs'
import {
  Input,
  Form,
  Button,
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
  TTCreateBody,
} from 'models'
import { DEFAULT_DATE_FORMAT } from '@/constants'
import useApi from '@/services/useApi'
import { useEffect } from 'react'

interface RenderProps {
  projectOptions?: ProjectRelation[]
  clientOptions?: ClientRelation[]
  onAdd: (newTT: TT) => void
  onError: (err: unknown) => void
}
export default function AddTT({
  projectOptions,
  clientOptions,
  onAdd,
  onError,
}: RenderProps) {
  const [form] = Form.useForm<TTCreateBody>()
  const { call: callCreate, loading: loadingCreate } = useApi(
    'timeTrack',
    'create'
  )

  useEffect(() => {
    form.resetFields()
  }, [form])

  const loading = () => loadingCreate

  async function onFinish(body: TTCreateBody) {
    try {
      const newTTId = await callCreate(body)
      const { date, ...rest } = body
      form.resetFields()
      onAdd(TT.create({ id: newTTId, date: date.dateObject, ...rest }))
    } catch (error) {
      onError(error)
    }
  }

  return (
    <>
      <Form
        form={form}
        name="basic"
        requiredMark={false}
        layout="inline"
        validateTrigger="onBlur"
        style={{ width: '100%' }}
        onFinish={onFinish}
        initialValues={TTCreateBody.createPartially({
          date: TimelessDate.fromDate(new Date()),
          hour: 1,
          description: '',
          billable: false,
          ticketNo: '',
        })}
      >
        <Form.Item
          name="date"
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
            style={{ width: '100%' }}
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
        >
          <Select
            placeholder="Select a client"
            options={clientOptions
              ?.map(e => ({
                value: e.abbr,
                label: `${e.abbr} - ${e.name}`,
              }))
              .sort((a, b) => a.label.localeCompare(b.label))}
          />
        </Form.Item>
        <Form.Item
          name="hour"
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
          rules={[
            {
              validator: TT.validator('description'),
              message: 'Please enter a value',
            },
          ]}
          style={{ flex: 1 }}
        >
          <Input placeholder="Description" style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item valuePropName="checked" name="billable" label="Billable">
          <Checkbox />
        </Form.Item>
        <Form.Item
          name="ticketNo"
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
          rules={[
            {
              required: true,
              message: 'Please select a project',
            },
          ]}
          name="projectAbbr"
        >
          <Select
            placeholder="Select a project"
            options={projectOptions
              ?.map(e => ({
                value: e.abbr,
                label: `${e.abbr} - ${e.name}`,
              }))
              .sort((a, b) => a.label.localeCompare(b.label))}
          />
        </Form.Item>
        <Button type="primary" htmlType="submit" loading={loading()}>
          Add
        </Button>
      </Form>
    </>
  )
}
