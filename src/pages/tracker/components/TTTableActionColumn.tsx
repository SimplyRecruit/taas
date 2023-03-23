import { MenuProps } from 'antd'
import { BiTrashAlt } from 'react-icons/bi'

import ActionMenu from '@/components/ActionMenu'
import { FiTrash, FiTrash2 } from 'react-icons/fi'

interface RenderProps {
  onDelete: () => void
}
export default function TTTableActionColumn({ onDelete }: RenderProps) {
  const menuItems: MenuProps['items'] = [
    {
      key: 'delete',
      icon: <FiTrash />,
      label: 'Delete',
      danger: true,
      onClick: onDelete,
    },
  ]

  return <ActionMenu items={menuItems} />
}
