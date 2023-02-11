import { FiEdit3, FiTrash2 } from 'react-icons/fi'
import { BiArchiveOut } from 'react-icons/bi'
import { MenuProps } from 'antd'
import ActionMenu from '@/components/ActionMenu'

interface RenderProps {
  onEdit: () => void
  onRestore: () => void
  onDelete: () => void
}
export default function ArchivedActionMenu({
  onRestore,
  onEdit,
  onDelete,
}: RenderProps) {
  const items: MenuProps['items'] = [
    {
      key: 'edit',
      icon: <FiEdit3 />,
      label: 'Edit',
      onClick: onEdit,
    },
    {
      key: 'restore',
      icon: <BiArchiveOut />,
      label: 'Restore',
      onClick: onRestore,
    },
    {
      key: 'delete',
      icon: <FiTrash2 />,
      label: 'Delete',
      onClick: onDelete,
      danger: true,
    },
  ]
  return <ActionMenu items={items} />
}
