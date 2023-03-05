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
  Modal,
  Spin,
  Table,
  Tooltip,
} from 'antd'
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons'
import { Project, TTBatchCreateBody, TTCreateBody } from 'models'
import { formatDate, momentToDate } from '@/util'
import { DEFAULT_DATE_FORMAT } from '@/constants'
import useApi from '@/services/useApi'
import { useEffect, useState } from 'react'
import BatchSpreadSheet from '@/pages/tracker/components/BatchSpreadSheet'

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
  const [showResultsModal, setShowResultsModal] = useState(false)
  const [batch, setBatch] = useState<TTBatchCreateBody | null>(null)
  const [batchData, setBatchData] = useState<any[][]>([[]])
  const { call: callClient, data: dataClient } = useApi('client', 'getAll')
  const { data: dataProject, call: callProject } = useApi('project', 'getAll')
  const { call: callCreate, loading: loadingCreate } = useApi(
    'timeTrack',
    'create'
  )
  const {
    call: callBatchCreate,
    data: dataBatchCreate,
    loading: loadingBatchCreate,
    error: errorBatchCreate,
  } = useApi('timeTrack', 'batchCreate')

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

  async function performBatchCreation() {
    try {
      if (batch === null) return
      setShowResultsModal(true)
      await callBatchCreate(batch)
    } catch (error) {
      console.log(error)
    }
    return
  }

  function retryFailedRows() {
    const indicesOfFailedRows =
      dataBatchCreate?.reduce<number[]>(
        (p, c, i) => (c.error ? [...p, i] : p),
        []
      ) ?? []
    setBatchData(batchData.filter((e, i) => indicesOfFailedRows.includes(i)))
    setShowResultsModal(false)
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
      <Collapse style={{ marginTop: 10, marginBottom: 10 }}>
        <Collapse.Panel header="Batch Addition" key="1">
          {dataClient && dataProject && (
            <>
              <BatchSpreadSheet
                ssData={batchData}
                onChange={setBatch}
                clientAbbrs={dataClient.map(e => e.abbr)}
                projectAbbrs={dataProject.map(e => e.abbr)}
              />
              <Button
                style={{ marginTop: 10 }}
                type="primary"
                disabled={batch === null}
                onClick={performBatchCreation}
              >
                Batch Add
              </Button>
            </>
          )}
        </Collapse.Panel>
      </Collapse>
      <Modal
        width={1000}
        closable={false}
        maskClosable={false}
        open={showResultsModal}
        title="Batch Creation"
        onOk={() => {
          setShowResultsModal(false)
        }}
        onCancel={() => {
          setShowResultsModal(false)
        }}
        footer={
          dataBatchCreate &&
          !loadingBatchCreate &&
          dataBatchCreate.some(e => !e.succeeded)
            ? [<CloseButton key="close" />, <RetryButton key="retry" />]
            : [<CloseButton key="close" />]
        }
      >
        {loadingBatchCreate && (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Spin tip="Performing Batch Creation" />
          </div>
        )}
        {dataBatchCreate && !loadingBatchCreate && (
          <Table
            dataSource={
              dataBatchCreate?.map((e, i) => ({ ...e, ...batchData[i] })) ?? []
            }
            rowKey={(r, i) => `${i}`}
            columns={[
              {
                title: '#',
                key: 'index',
                render: (text, record, index) => index + 1,
              },
              {
                title: 'Date',
                dataIndex: '0',
                key: 'date',
                render: (value: Date) => <span>{formatDate(value)}</span>,
              },
              {
                title: 'Client',
                dataIndex: '1',
                key: 'client',
              },
              {
                title: 'Hour',
                dataIndex: '2',
                key: 'hour',
              },
              {
                title: 'Description',
                dataIndex: '3',
                key: 'description',
              },
              {
                title: 'Billabe',
                dataIndex: '4',
                key: 'billable',
                render: value => (value ? 'YES' : 'NO'),
              },
              {
                title: 'Ticket no',
                dataIndex: '5',
                key: 'ticketNo',
              },
              {
                title: 'Project',
                dataIndex: '6',
                key: 'project',
              },
              {
                title: 'Result',
                key: 'succeeded',
                dataIndex: 'succeeded',
                render: (value, record) =>
                  value ? (
                    <Tooltip placement="right" title="Success">
                      <CheckCircleOutlined
                        style={{ fontSize: 18, color: '#0a0' }}
                      />
                    </Tooltip>
                  ) : (
                    <Tooltip placement="right" title={record.error}>
                      <CloseCircleOutlined
                        style={{ fontSize: 18, color: '#a00' }}
                      />
                    </Tooltip>
                  ),
              },
            ]}
            pagination={false}
          />
        )}
        {errorBatchCreate && <div>Hata</div>}
      </Modal>
    </>
  )

  function CloseButton() {
    return (
      <Button
        onClick={() => {
          setShowResultsModal(false)
        }}
      >
        Close
      </Button>
    )
  }

  function RetryButton() {
    return (
      <Button type="primary" onClick={retryFailedRows}>
        Retry Failed Rows
      </Button>
    )
  }
}
