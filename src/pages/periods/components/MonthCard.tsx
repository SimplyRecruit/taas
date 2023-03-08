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
  Tag,
  Card,
} from 'antd'
import { Client, ClientContractType } from 'models'
import { CloseOutlined } from '@ant-design/icons'
import { momentToDate } from '@/util'
import { DEFAULT_DATE_FORMAT } from '@/constants'
import ClientCreateBody from 'models/Client/req-bodies/ClientCreateBody'
import useApi from '@/services/useApi'
import { useEffect } from 'react'

interface RenderProps {
  active: boolean
  date: Date
  onCancel?: () => void
}
export default function MonthCard({ active, date, onCancel }: RenderProps) {
  return (
    <Card
      title={date.toLocaleString('default', {
        month: 'long',
      })}
      extra={
        <Space>
          {active ? (
            <Tag color="success">Active</Tag>
          ) : (
            <Tag color="warning">Inactive</Tag>
          )}
        </Space>
      }
      actions={[
        <Button key="details" type="link" size="small">
          See details
        </Button>,
        <Button key="active" type="link" size="small">
          Activate
        </Button>,
      ]}
    >
      Total 100 time tracks
    </Card>
  )
}
