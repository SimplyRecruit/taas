import { TT, TTGetAllParams, User } from 'models'
import {
  In,
  MoreThanOrEqual,
  LessThanOrEqual,
  And,
  EntityManager,
} from 'typeorm'
import { includesText } from '~/common/Util'
import TimeTrackEntity from '~/resources/TimeTrack/Entity'

export async function getAllTTs(
  params: TTGetAllParams,
  currentUser: User,
  options = { usePagination: true }
) {
  const {
    order,
    userIds,
    updatedByIds,
    clientIds,
    partnerNames,
    projectIds,
    billableValues,
    isMe,
    dateAfter,
    dateBefore,
    searchTexts,
  } = params

  let { take, skip } = params

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
      updatedBy: {
        organization: { id: currentUser.organization.id },
        id: updatedByIds && updatedByIds.length ? In(updatedByIds) : undefined,
      },
      project: {
        id: projectIds && projectIds.length ? In(projectIds) : undefined,
      },
      client: {
        id: clientIds && clientIds.length ? In(clientIds) : undefined,
        partnerName:
          partnerNames && partnerNames.length ? In(partnerNames) : undefined,
      },
      billable:
        billableValues && billableValues.length
          ? In(billableValues)
          : undefined,
      date: dateBetween(dateAfter, dateBefore),
      description: includesText(searchTexts.description),
      ticketNo: includesText(searchTexts.ticketNo),
    },
    relations: { user: !isMe, client: true, project: true, updatedBy: !isMe },
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
      updatedBy: {
        abbr: !isMe,
      },
    },
  })
}

export async function getTT(id: string, em?: EntityManager) {
  const findOptions = {
    where: { id },
    relations: { user: true, client: true, project: true, updatedBy: true },
    select: {
      id: true,
      description: true,
      date: true,
      billable: true,
      user: {
        abbr: true,
      },
      updatedBy: {
        abbr: true,
      },
    },
  }
  const ttEntity = em
    ? await em.findOneOrFail(TimeTrackEntity, findOptions)
    : await TimeTrackEntity.findOneOrFail(findOptions)
  return TT.create({
    billable: ttEntity.billable,
    clientAbbr: ttEntity.client.abbr,
    date: ttEntity.date,
    description: ttEntity.description,
    hour: ttEntity.hour,
    id: ttEntity.id,
    partnerName: ttEntity.client.partnerName,
    projectAbbr: ttEntity.project.abbr,
    ticketNo: ttEntity.ticketNo,
    updatedByAbbr: ttEntity.updatedBy.abbr,
    userAbbr: ttEntity.user.abbr,
  })
}

function dateBetween(dateAfter?: Date, dateBefore?: Date) {
  if (dateAfter && dateBefore) {
    return And(MoreThanOrEqual(dateAfter), LessThanOrEqual(dateBefore))
  } else if (dateAfter) {
    return MoreThanOrEqual(dateAfter)
  } else if (dateBefore) {
    return LessThanOrEqual(dateBefore)
  } else {
    return undefined
  }
}
