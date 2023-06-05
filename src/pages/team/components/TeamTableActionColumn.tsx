import { FiEdit2 } from 'react-icons/fi'
import { MenuProps, Space } from 'antd'
import { BiArchiveIn, BiArchiveOut } from 'react-icons/bi'
import ActionMenu from '@/components/ActionMenu'
import { MdOutlineMail } from 'react-icons/md'
import { Resource, UserStatus } from 'models'

interface RenderProps {
  onEdit: () => void
  onArchive: () => void
  onRestore: () => void
  onSendEmail: () => void
  resource: Resource
}
export default function TeamTableActionColumn({
  onEdit,
  onArchive,
  onRestore,
  onSendEmail,
  resource,
}: RenderProps) {
  const activeMenuItems: MenuProps['items'] = [
    {
      key: 'archive',
      icon: <BiArchiveIn />,
      label: 'Archive',
      onClick: onArchive,
    },
  ]
  const pendingMenuItems: MenuProps['items'] = [
    {
      key: 'invite',
      icon: <MdOutlineMail />,
      label: 'Send invite email',
      onClick: onSendEmail,
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

  let actionMenuItems
  if (resource.status == UserStatus.PENDING) actionMenuItems = pendingMenuItems
  else if (resource.active) actionMenuItems = activeMenuItems
  else actionMenuItems = archivedMenuItems
  return (
    <Space>
      <FiEdit2 style={{ cursor: 'pointer' }} onClick={onEdit} />
      <ActionMenu items={actionMenuItems} />
    </Space>
  )
}
