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
import { Client, ClientRelation, Project, TT, TTCreateBody } from 'models'
import { momentToDate } from '@/util'
import { DEFAULT_DATE_FORMAT } from '@/constants'
import useApi from '@/services/useApi'
import { useEffect } from 'react'

interface RenderProps {
  projectOptions: Project[]
  clientOptions: Client[]
  onAdd: (newTT: TT) => void
}
export default function AddTT({
  projectOptions,
  clientOptions,
  onAdd,
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
      form.resetFields()
      onAdd(TT.create({ id: newTTId, ...body }))
    } catch (error) {
      /* empty */
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
          date: new Date(),
          description: '',
          billable: false,
          ticketNo: '',
        })}
      >
        <Form.Item
          name="date"
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
              message: 'Please select a client',
            },
          ]}
          name="clientAbbr"
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
          rules={[
            {
              required: true,
              message: 'Please enter a value',
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
              validator: Project.validator('name'),
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
              validator: Project.validator('name'),
              message: 'Please enter a value',
            },
          ]}
        >
          <Input placeholder="Ticket no" />
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
            options={projectOptions?.map(e => ({
              value: e.abbr,
              label: `${e.abbr} - ${e.name}`,
            }))}
          />
        </Form.Item>
        <Button type="primary" htmlType="submit" loading={loading()}>
          Add
        </Button>
      </Form>
    </>
  )
}
