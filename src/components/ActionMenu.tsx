import { FiLink, FiEdit3, FiMoreVertical } from 'react-icons/fi'
import { BiArchiveIn } from 'react-icons/bi'
import { MenuProps, Dropdown, Button } from 'antd'

export default function ActionMenu() {
  const items: MenuProps['items'] = [
    {
      key: 'edit',
      icon: <FiEdit3 />,
      label: 'Edit',
    },

    {
      key: 'share',
      icon: <FiLink />,
      label: 'Share',
    },
    {
      key: 'archive',
      icon: <BiArchiveIn />,
      label: 'Archive',
      onClick: () => {
        console.log('event')
      },
    },
  ]
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
        icon={<FiMoreVertical size={18} />}
        id="action-button"
        type="ghost"
      />
    </Dropdown>
  )
}
