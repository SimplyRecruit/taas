import { FiEdit3, FiTrash2 } from 'react-icons/fi'
import { BiArchiveOut } from 'react-icons/bi'
import { MenuProps } from 'antd'
import ActionMenu from '@/components/ActionMenu'

interface RenderProps {
  onRestore: () => void
  onEdit: () => void
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
      key: 'archive',
      icon: <BiArchiveOut />,
      label: 'Archive',
      onClick: onRestore,
    },
    {
      key: 'delete',
      icon: <FiTrash2 />,
      label: 'Delete',
      onClick: onDelete,
    },
  ]
  return <ActionMenu items={items} />
}
