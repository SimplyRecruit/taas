import LoginReqBody from '../../../models/LoginReqBody';
import { Body, Get, Post, JsonController, UnauthorizedError, CurrentUser, InternalServerError, QueryParams, QueryParam, BadRequestError, HttpError, Delete, Authorized, Param, ForbiddenError, NotFoundError, Put } from 'routing-controllers';
import Bcrypt from "bcrypt"
import Jwt from "jsonwebtoken"
import { UserEntity } from '../User/Entity';
import UserRole from '../../../models/UserRole';
import { WorkPeriodEntity } from './Entity';
import { OrganizationEntity } from '../Organization/Entity';
import TableQueryParameters from '../../../models/TableQueryParameters';
import { EntityNotFoundError, EntityPropertyNotFoundError } from 'typeorm';
import WorkPeriod from '../../../models/WorkPeriod';
import { dataSource } from '../../../server/main';
@JsonController("/work-period")
@Authorized(UserRole.ADMIN)
export default class {

    @Get()
    async getAll(@CurrentUser() currentUser: UserEntity, @QueryParams() { order, take, skip }: TableQueryParameters) {
        try {
            const [workPeriods, count] = await WorkPeriodEntity.findAndCount({
                where: { organization: { id: currentUser.organization.id } },
                order, take, skip
            })
            console.log(workPeriods);
            return { workPeriods: workPeriods.map(wp => ({ closed: wp.closed, period: `${wp.period.getUTCMonth()}`.padStart(2, '0') + `/${wp.period.getUTCFullYear()}` })), count }
        } catch (error) {
            if (error instanceof EntityPropertyNotFoundError) throw new BadRequestError("Invalid column name for sorting");
            else throw new InternalServerError("Internal Server Error")
        }
    }

    @Post()
    async create(@CurrentUser() currentUser: UserEntity, @Body() { periodDate }: WorkPeriod) {
        await dataSource.transaction(async em => {
            const existing = await em.findOneBy(WorkPeriodEntity, {
                period: periodDate,
                organization: { id: currentUser.organization.id }
            })
            if (existing !== null) throw new HttpError(409, "Period already exists")
            await em.create(WorkPeriodEntity, {
                organization: currentUser.organization,
                period: periodDate
            }).save()
        })
        return "Done"
    }

    @Delete()
    async delete(@CurrentUser() currentUser: UserEntity, @Body() { periodDate }: WorkPeriod) {
        await dataSource.transaction(async em => {
            try {
                const workPeriod = await em.findOneOrFail(WorkPeriodEntity, { where: { period: periodDate }, relations: { organization: true } })
                if (workPeriod.organization.id !== currentUser.organization.id) throw new ForbiddenError()
                await em.remove(workPeriod)
            } catch (error) {
                if (error instanceof EntityNotFoundError) throw new NotFoundError()
                else if (error instanceof ForbiddenError) throw new ForbiddenError()
                else throw new InternalServerError("Internal Server Error")
            }
        })
        return "Work Period Deletion Successful"
    }

    @Put()
    async toggle(@CurrentUser() currentUser: UserEntity, @Body() { periodDate }: WorkPeriod) {
        await dataSource.transaction(async em => {
            try {
                const workPeriod = await em.findOneOrFail(WorkPeriodEntity, { where: { period: periodDate }, relations: { organization: true } })
                if (workPeriod.organization.id !== currentUser.organization.id) throw new ForbiddenError()
                workPeriod.closed = !workPeriod.closed
                await em.save(workPeriod)
            } catch (error) {
                if (error instanceof EntityNotFoundError) throw new NotFoundError()
                else if (error instanceof ForbiddenError) throw new ForbiddenError()
                else throw new InternalServerError("Internal Server Error")
            }
        })
        return "Done"
    }
}