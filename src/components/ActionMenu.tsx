import { FiMoreVertical } from 'react-icons/fi'
import { MenuProps, Dropdown, Button } from 'antd'

interface RenderProps {
  items: MenuProps['items']
}
export default function ActionMenu({ items }: RenderProps) {
  return (
    <Dropdown
      menu={{
        items,
      }}
      placement="bottomLeft"
      trigger={['click']}
    >
      <Button size="small" icon={<FiMoreVertical size={18} />} type="ghost" />
    </Dropdown>
  )
}
