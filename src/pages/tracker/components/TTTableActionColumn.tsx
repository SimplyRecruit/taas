import { MenuProps, Space } from 'antd'
import { BiTrashAlt } from 'react-icons/bi'

import ActionMenu from '@/components/ActionMenu'
import { FiEdit2, FiTrash } from 'react-icons/fi'

interface RenderProps {
  onDelete: () => void
  onEdit: () => void
}
export default function TTTableActionColumn({ onDelete, onEdit }: RenderProps) {
  const menuItems: MenuProps['items'] = [
    {
      key: 'delete',
      icon: <FiTrash />,
      label: 'Delete',
      danger: true,
      onClick: onDelete,
    },
  ]

  return (
    <Space>
      <FiEdit2 style={{ cursor: 'pointer' }} onClick={onEdit} />
      <ActionMenu items={menuItems} />
    </Space>
  )
}
