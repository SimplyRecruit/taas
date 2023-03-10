import { FiChevronDown } from 'react-icons/fi'
import { Button } from 'antd'

interface RenderProps {
  title: string
}
export default function DropdownButton({ title, ...props }: RenderProps) {
  return (
    <Button
      {...props}
      type="ghost"
      style={{
        display: 'flex',
        alignItems: 'center',
      }}
    >
      {title}
      <FiChevronDown size={16} style={{ marginLeft: 4 }} />
    </Button>
  )
}
