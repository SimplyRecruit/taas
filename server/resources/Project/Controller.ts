import { Project, UserRole } from 'models'

import { Authorized, CurrentUser, JsonController } from 'routing-controllers'

import UserEntity from '~/resources/User/Entity'

import { Get } from '~/decorators/CustomApiMethods'
import ProjectEntity from '~/resources/Project/Entity'

@JsonController('/project')
export default class ProjectController {
  @Get([Project])
  @Authorized(UserRole.ADMIN)
  async getAll(@CurrentUser() currentUser: UserEntity) {
    const entityObjects = await ProjectEntity.find({
      where: { organization: { id: currentUser.organization.id } },
      relations: { client: true },
    })
    return entityObjects
  }
}
