import { formatDate } from '@/util'

interface RenderProps {
  value: Date | string
}
export default function DateCell({ value }: RenderProps) {
  return <div style={{ textAlign: 'right' }}>{formatDate(value)}</div>
}
