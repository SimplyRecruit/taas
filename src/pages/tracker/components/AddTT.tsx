import moment from 'dayjs'
import {
  Input,
  Form,
  Button,
  DatePicker,
  Select,
  Checkbox,
  InputNumber,
  Collapse,
} from 'antd'
import { Project, TTBatchCreateBody, TTCreateBody } from 'models'
import { momentToDate } from '@/util'
import { DEFAULT_DATE_FORMAT } from '@/constants'
import useApi from '@/services/useApi'
import { useEffect, useState } from 'react'
import SpreadSheet from '@/pages/tracker/components/SpreadSheet'

interface RenderProps {
  value?: Project | null
  onAdd?: (newProject: Project) => void
  onUpdate?: (updatedProject: Project) => void
  onCancel?: () => void
}
export default function AddTT({
  onAdd,
  value,
  onUpdate,
  onCancel,
}: RenderProps) {
  const [form] = Form.useForm<TTCreateBody>()
  const [batch, setBatch] = useState('')
  const { call: callClient, data: dataClient } = useApi('client', 'getAll')
  const { data: dataProject, call: callProject } = useApi('project', 'getAll')
  const { call: callCreate, loading: loadingCreate } = useApi(
    'timeTrack',
    'create'
  )
  const { call: callBatchCreate, loading: loadingBatchCreate } = useApi(
    'timeTrack',
    'batchCreate'
  )

  useEffect(() => {
    form.resetFields()
  }, [form, value])

  useEffect(() => {
    callClient()
    callProject()
  }, [])

  const loading = () => loadingCreate

  async function onFinish(body: TTCreateBody) {
    try {
      await callCreate(body)
      form.resetFields()
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
            options={dataClient?.map(e => ({
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
            options={dataProject?.map(e => ({
              value: e.abbr,
              label: `${e.abbr} - ${e.name}`,
            }))}
          />
        </Form.Item>
        <Button type="primary" htmlType="submit" loading={loading()}>
          Add
        </Button>
      </Form>
      <Collapse>
        <Collapse.Panel header="Batch Addition" key="1">
          {/* <Input.TextArea
            rows={4}
            value={batch}
            onChange={e => setBatch(e.target.value)}
          /> */}
          {dataClient && dataProject && (
            <>
              <SpreadSheet
                clientAbbrs={dataClient?.map(e => e.abbr) || []}
                projectAbbrs={dataProject?.map(e => e.abbr) || []}
              />
              <Button
                type="primary"
                onClick={async () => {
                  try {
                    const returned = await callBatchCreate(
                      await TTBatchCreateBody.parse(batch)
                    )
                    console.log(returned)
                  } catch (error) {
                    console.log(error)
                  }
                  return
                }}
              >
                Batch Add
              </Button>
            </>
          )}
        </Collapse.Panel>
      </Collapse>
    </>
  )
}
