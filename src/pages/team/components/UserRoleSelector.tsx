import { Select } from 'antd'
import { UserRole } from 'models'
import { NON_SUPER_USER_ROLES } from 'models/User/enums/UserRole'
interface RenderProps {
  onChange: (value: UserRole) => void
  role: UserRole
}
const UserRoleSelector = ({ onChange, role }: RenderProps) => {
  return (
    <Select value={role} onChange={value => onChange(value)}>
      {NON_SUPER_USER_ROLES.map(r => (
        <Select.Option value={r as UserRole} key={r}>
          {r}
        </Select.Option>
      ))}
    </Select>
  )
}

export default UserRoleSelector
