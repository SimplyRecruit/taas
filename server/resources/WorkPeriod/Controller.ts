import { UserRole, WorkPeriod } from 'models'
import {
  Authorized,
  BadRequestError,
  CurrentUser,
  ForbiddenError,
  HttpError,
  InternalServerError,
  JsonController,
  NotFoundError,
} from 'routing-controllers'
import { EntityNotFoundError, EntityPropertyNotFoundError } from 'typeorm'
import { Delete, Get, Post } from '~/decorators/CustomApiMethods'
import { Body } from '~/decorators/CustomRequestParams'
import { dataSource } from '~/main'
import UserEntity from '~/resources/User/Entity'
import WorkPeriodEntity from '~/resources/WorkPeriod/Entity'
@JsonController('/work-period')
@Authorized(UserRole.ADMIN)
export default class WorkPeriodController {
  @Get([WorkPeriod])
  async getAll(@CurrentUser() currentUser: UserEntity) {
    try {
      const workPeriods = await WorkPeriodEntity.find({
        where: { organization: { id: currentUser.organization.id } },
      })
      return workPeriods
    } catch (error) {
      console.log(error)
      if (error instanceof EntityPropertyNotFoundError)
        throw new BadRequestError('Invalid column name for sorting')
      else throw new InternalServerError('Internal Server Error')
    }
  }

  @Post(String)
  async create(
    @CurrentUser() currentUser: UserEntity,
    @Body() { periodString }: WorkPeriod
  ) {
    await dataSource.transaction(async em => {
      const existing = await em.findOneBy(WorkPeriodEntity, {
        period: periodString,
        organization: { id: currentUser.organization.id },
      })
      if (existing !== null) throw new HttpError(409, 'Period already exists')
      await em.save(WorkPeriodEntity, {
        organization: currentUser.organization,
        period: periodString,
      })
    })
    return 'Done'
  }

  @Delete(String)
  async delete(
    @CurrentUser() currentUser: UserEntity,
    @Body() { periodString }: WorkPeriod
  ) {
    await dataSource.transaction(async em => {
      try {
        const workPeriod = await em.findOneOrFail(WorkPeriodEntity, {
          where: { period: periodString },
          relations: { organization: true },
        })
        if (workPeriod.organization.id !== currentUser.organization.id)
          throw new ForbiddenError()
        await em.remove(workPeriod)
      } catch (error) {
        if (error instanceof EntityNotFoundError) throw new NotFoundError()
        else if (error instanceof ForbiddenError) throw new ForbiddenError()
        else throw new InternalServerError('Internal Server Error')
      }
    })
    return 'Work Period Deletion Successful'
  }
}
