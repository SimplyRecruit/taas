import { BiArchiveIn } from 'react-icons/bi'
import { MenuProps } from 'antd'
import ActionMenu from '@/components/ActionMenu'

interface RenderProps {
  onArchive: () => void
}
export default function ActiveActionMenu({ onArchive }: RenderProps) {
  const items: MenuProps['items'] = [
    {
      key: 'archive',
      icon: <BiArchiveIn />,
      label: 'Archive',
      onClick: onArchive,
    },
  ]
  return <ActionMenu items={items} />
}
