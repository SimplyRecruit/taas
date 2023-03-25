import { ReportReqBody, UserRole } from 'models'

import { CurrentUser, JsonController } from 'routing-controllers'

import UserEntity from '~/resources/User/Entity'

import { Post } from '~/decorators/CustomApiMethods'

import { Body } from '~/decorators/CustomRequestParams'
import Report from 'models/Report/Report'
import { getReport } from '~/resources/Report/Service'

@JsonController('/report')
export default class ReportController {
  @Post([Report])
  async get(
    @Body()
    body: ReportReqBody,
    @CurrentUser() currentUser: UserEntity
  ) {
    if (currentUser.role == UserRole.END_USER) body.userIds = [currentUser.id]

    return getReport(currentUser.organization.id, body)
  }
}
