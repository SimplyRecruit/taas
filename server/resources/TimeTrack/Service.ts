import { TTGetAllParams, User } from 'models'
import { In } from 'typeorm'
import TimeTrackEntity from '~/resources/TimeTrack/Entity'

export async function getAllTTs(
  { order, take, skip, userIds, clientIds, projectIds, isMe }: TTGetAllParams,
  currentUser: User,
  options = { usePagination: true }
) {
  if (!options.usePagination) {
    take = undefined
    skip = undefined
  }
  return await TimeTrackEntity.findAndCount({
    where: {
      user: {
        organization: { id: currentUser.organization.id },
        id: userIds && userIds.length ? In(userIds) : undefined,
      },
      project: {
        id: projectIds && projectIds.length ? In(projectIds) : undefined,
      },
      client: {
        id: clientIds && clientIds.length ? In(clientIds) : undefined,
      },
    },
    relations: { user: !isMe, client: true, project: true },
    order,
    take,
    skip,
    select: {
      id: true,
      description: true,
      date: true,
      billable: true,
      hour: true,
      ticketNo: true,
      user: {
        abbr: !isMe,
      },
    },
  })
}
