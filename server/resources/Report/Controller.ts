import { ReportReqBody, UserRole } from 'models'

import {
  CurrentUser,
  ForbiddenError,
  JsonController,
} from 'routing-controllers'

import UserEntity from '~/resources/User/Entity'

import { Post } from '~/decorators/CustomApiMethods'

import { Body } from '~/decorators/CustomRequestParams'
import Report from 'models/Report/Report'
import { getReport, getTrackerHours } from '~/resources/Report/Service'
import GetTrackerHoursReqBody from 'models/Report/GetTrackerHoursReqBody'

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

  @Post(Number, '/tracker-hours')
  async getTrackerHours(
    @Body()
    body: GetTrackerHoursReqBody,
    @CurrentUser() currentUser: UserEntity
  ) {
    // Permission check
    if (body.isMe) body.userIds = [currentUser.id]
    else if (currentUser.role != UserRole.ADMIN) throw new ForbiddenError()

    return getTrackerHours(currentUser.organization.id, body)
  }
}
