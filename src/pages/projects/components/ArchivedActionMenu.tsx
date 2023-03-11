import { FiTrash2 } from 'react-icons/fi'
import { BiArchiveOut } from 'react-icons/bi'
import { MenuProps } from 'antd'
import ActionMenu from '@/components/ActionMenu'

interface RenderProps {
  onRestore: () => void
  onDelete: () => void
}
export default function ArchivedActionMenu({
  onRestore,
  onDelete,
}: RenderProps) {
  const items: MenuProps['items'] = [
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
