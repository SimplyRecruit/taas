import UserRoleSelector from '@/pages/team/components/UserRoleSelector'
import { Modal, InputNumber, Input, Space } from 'antd'
import { InviteMemberReqBody, UserRole } from 'models'
import { useState } from 'react'
interface RenderProps {
  open: boolean
  onAdd: (newMember: InviteMemberReqBody) => void
  onCancel: () => void
}
const InviteMemberModal = ({ open, onAdd, onCancel }: RenderProps) => {
  const [newMember, setNewMember] = useState(
    InviteMemberReqBody.createPartially({
      hourlyRate: 0,
    })
  )

  const onOk = () => {
    onAdd(newMember)
  }
  return (
    <Modal title="Invite Member" open={open} onOk={onOk} onCancel={onCancel}>
      <Space direction="vertical">
        <Input
          placeholder="Name"
          value={newMember.name}
          onChange={e => {
            newMember.name = e.target.value
            setNewMember({ ...newMember })
          }}
          style={{ width: '100%' }}
        />
        <Input
          placeholder="E-mail"
          value={newMember.email}
          onChange={e => {
            newMember.email = e.target.value
            setNewMember({ ...newMember })
          }}
          style={{ width: '100%' }}
        />
        <InputNumber placeholder="Hourly Rate" value={newMember.hourlyRate} />
        <UserRoleSelector
          role={newMember.role}
          onChange={value => {
            newMember.role = value
          }}
        />
      </Space>
    </Modal>
  )
}

export default InviteMemberModal
