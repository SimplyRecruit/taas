import { FiEdit3 } from 'react-icons/fi'
import { BiArchiveIn } from 'react-icons/bi'
import { MenuProps } from 'antd'
import ActionMenu from '@/components/ActionMenu'

interface RenderProps {
  onArchive: () => void
  onEdit: () => void
}
export default function ActiveActionMenu({ onArchive, onEdit }: RenderProps) {
  const items: MenuProps['items'] = [
    {
      key: 'edit',
      icon: <FiEdit3 />,
      label: 'Edit',
      onClick: onEdit,
    },
    {
      key: 'archive',
      icon: <BiArchiveIn />,
      label: 'Archive',
      onClick: onArchive,
    },
  ]
  return <ActionMenu items={items} />
}
