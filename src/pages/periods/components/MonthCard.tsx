import { Button, Space, Tag, Card } from 'antd'

interface RenderProps {
  active: boolean
  date: Date
  onToggleStatus: (date: Date, active: boolean) => void
}
export default function MonthCard({
  active,
  date,
  onToggleStatus,
}: RenderProps) {
  return (
    <Card
      title={date.toLocaleString('default', {
        month: 'long',
      })}
      extra={
        <Space>
          {active ? <Tag color="success">Active</Tag> : <Tag>Inactive</Tag>}
        </Space>
      }
      actions={[
        <Button key="details" type="link" size="small">
          See details
        </Button>,
        <Button
          onClick={() => onToggleStatus(date, active)}
          key="active"
          type="link"
          size="small"
        >
          {active ? 'Deactivate' : 'Activate'}
        </Button>,
      ]}
    >
      {date.toISOString()}
      Total 100 time tracks
    </Card>
  )
}
