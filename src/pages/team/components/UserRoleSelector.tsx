import { Radio, Select, Space } from 'antd'
import { UserRole } from 'models'
import { NON_SUPER_USER_ROLES } from 'models/User/enums/UserRole'
interface RenderProps {
  onChange?: (value: UserRole) => void
  value?: UserRole
}
const UserRoleSelector = ({ onChange, value }: RenderProps) => {
  return (
    <Radio.Group
      value={value}
      onChange={e => (onChange ? onChange(e.target.value) : null)}
    >
      <Space size="middle" direction="vertical">
        {NON_SUPER_USER_ROLES.map(r => (
          <Radio value={r as UserRole} key={r}>
            {r}
          </Radio>
        ))}
      </Space>
    </Radio.Group>
  )
}

export default UserRoleSelector
