import { createParamDecorator } from 'routing-controllers'
import { currentOrganizationChecker } from '~/resources/User/AuthService'

export default function CurrentOrganization() {
  return createParamDecorator({
    value: currentOrganizationChecker,
  })
}
