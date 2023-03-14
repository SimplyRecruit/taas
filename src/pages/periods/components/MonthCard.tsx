import useColor from '@/styles/useColor'
import { Button, Card, Badge } from 'antd'

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
  const { getColor } = useColor()
  return (
    <Badge.Ribbon
      text={active ? 'Active' : 'Inactive'}
      color={active ? getColor('blue') : getColor('blue', 2)}
    >
      <Card
        title={date.toLocaleString('default', {
          month: 'long',
        })}
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
        Total 74 time tracks
      </Card>
    </Badge.Ribbon>
  )
}
