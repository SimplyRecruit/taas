enum UserRole {
  SU = 'SU',
  ADMIN = 'ADMIN',
  TT_MANAGER = 'TT_MANAGER',
  END_USER = 'END_USER',
}

export const SUPER_USER_ROLES = [UserRole.SU]
export const NON_SUPER_USER_ROLES = Object.keys(UserRole).filter(
  e => !SUPER_USER_ROLES.includes(e as UserRole)
)
export default UserRole
