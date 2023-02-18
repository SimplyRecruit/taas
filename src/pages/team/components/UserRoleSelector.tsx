import { Select } from 'antd'
import { UserRole } from 'models'
import { NON_SUPER_USER_ROLES } from 'models/User/enums/UserRole'
interface RenderProps {
  onChange?: (value: UserRole) => void
  value?: UserRole
}
const UserRoleSelector = ({ onChange, value }: RenderProps) => {
  return (
    <Select
      value={value}
      onChange={value => (onChange ? onChange(value) : null)}
    >
      {NON_SUPER_USER_ROLES.map(r => (
        <Select.Option value={r as UserRole} key={r}>
          {r}
        </Select.Option>
      ))}
    </Select>
  )
}

export default UserRoleSelector
