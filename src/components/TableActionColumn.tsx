import { FiEdit2 } from 'react-icons/fi'
import { MenuProps, Space } from 'antd'
import { BiArchiveIn, BiArchiveOut } from 'react-icons/bi'
import ActionMenu from '@/components/ActionMenu'

interface RenderProps {
  onEdit: () => void
  onArchive: () => void
  onRestore: () => void
  isActive: boolean
}
export default function TableActionColumn({
  onEdit,
  onArchive,
  onRestore,
  isActive,
}: RenderProps) {
  const activeMenuItems: MenuProps['items'] = [
    {
      key: 'archive',
      icon: <BiArchiveIn />,
      label: 'Archive',
      onClick: onArchive,
    },
  ]
  const archivedMenuItems: MenuProps['items'] = [
    {
      key: 'restore',
      icon: <BiArchiveOut />,
      label: 'Restore',
      onClick: onRestore,
    },
  ]

  return (
    <Space>
      <FiEdit2 style={{ cursor: 'pointer' }} onClick={onEdit} />
      {isActive ? (
        <ActionMenu items={activeMenuItems} />
      ) : (
        <ActionMenu items={archivedMenuItems} />
      )}
    </Space>
  )
}
