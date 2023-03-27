import {
  ClientRelation,
  ProjectRelation,
  GetClientsAndProjectsResBody,
} from 'models'
import { InternalServerError } from 'routing-controllers'
import { In } from 'typeorm'
import { ALL_UUID } from '~/common/Config'
import ClientEntity from '~/resources/Client/Entity'
import ProjectEntity from '~/resources/Project/Entity'

export async function getClientsAndProjectsOf(
  organizationId: string,
  userId: string
) {
  // TODO Use EM
  try {
    const clients = (await ClientEntity.find({
      where: {
        organization: { id: organizationId },
        clientUser: { user: { id: In([ALL_UUID, userId]) } },
        active: true,
      },
      select: {
        id: true,
        abbr: true,
        name: true,
      },
    })) as ClientRelation[]

    const projects = (await ProjectEntity.find({
      where: {
        organization: { id: organizationId },
        clientId: In([ALL_UUID, ...clients.map(e => e.id)]),
        active: true,
      },
      select: {
        id: true,
        name: true,
        abbr: true,
      },
    })) as ProjectRelation[]

    return { clients, projects } as GetClientsAndProjectsResBody
  } catch (error: unknown) {
    throw new InternalServerError('Internal Server Error')
  }
}
