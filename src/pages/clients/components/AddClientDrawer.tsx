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
  Radio,
  Select,
} from 'antd'
import { Client, ClientContractType, Resource } from 'models'
import { CloseOutlined } from '@ant-design/icons'
import { dateToMoment } from '@/util'
import { DEFAULT_DATE_FORMAT } from '@/constants'
import ClientCreateBody from 'models/Client/req-bodies/ClientCreateBody'
import useApi from '@/services/useApi'
import { useEffect, useState } from 'react'

interface RenderProps {
  open: boolean
  onAdd: (newMember: Client) => void
  onCancel: () => void
}
export default function AddClientDrawer({
  open,
  onAdd,
  onCancel,
}: RenderProps) {
  const [form] = Form.useForm()
  const everyoneHasAccess = Form.useWatch('everyoneHasAccess', form)
  const { call, data, loading, error } = useApi('resource', 'getAll') as {
    data: Resource[]
    call: () => Promise<any>
    loading: boolean
    error: any
  }
  // const [resources, setResources] = useState<Resource[]>([])
  // const filteredOptions = OPTIONS.filter(o => !selectedItems.includes(o))

  useEffect(() => {
    call().then(r => {
      // setResources(r)
    })
  }, [])

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

  return (
    <Drawer
      getContainer={false}
      title="Add Client"
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
      <Form
        form={form}
        requiredMark="optional"
        name="basic"
        layout="vertical"
        validateTrigger="onBlur"
        style={{ width: '100%' }}
        initialValues={ClientCreateBody.createPartially({
          active: true,
          id: '',
          name: '',
          partnerName: '',
          startDate: new Date(),
        })}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item
          required
          name="id"
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
        <Form.Item name="everyoneHasAccess" label="Accessable by" required>
          <Radio.Group>
            <Radio key="everyone" value={true}>
              Everyone
            </Radio>
            <Radio key="custom" value={false}>
              Custom
            </Radio>
          </Radio.Group>
        </Form.Item>
        {everyoneHasAccess === false && !loading && !!data && (
          <Form.Item name="resourceIds">
            <Select
              filterOption={(inputValue, option) =>
                option?.label
                  .toLocaleLowerCase()
                  .includes(inputValue.toLocaleLowerCase()) ?? false
              }
              mode="multiple"
              allowClear
              style={{ width: '100%' }}
              placeholder="Please select"
              options={data.map(e => ({
                value: e.id,
                label: `${e.id} - ${e.name}`,
              }))}
            />
          </Form.Item>
        )}
      </Form>
    </Drawer>
  )
}
