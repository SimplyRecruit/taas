import { FiMoreVertical } from 'react-icons/fi'
import { MenuProps, Dropdown, Button } from 'antd'

interface RenderProps {
  items: MenuProps['items']
}
export default function ActionMenu({ items }: RenderProps) {
  return (
    <Dropdown
      getPopupContainer={() =>
        document.getElementById('action-button') as HTMLElement
      }
      menu={{
        items,
      }}
      placement="bottomLeft"
      trigger={['click']}
    >
      <Button
        size="small"
        icon={<FiMoreVertical size={18} />}
        id="action-button"
        type="ghost"
      />
    </Dropdown>
  )
}
