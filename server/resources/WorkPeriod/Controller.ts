import LoginReqBody from '../../../models/LoginReqBody';
import { Body, Get, Post, JsonController, UnauthorizedError, CurrentUser, InternalServerError, QueryParams, QueryParam, BadRequestError, HttpError } from 'routing-controllers';
import Bcrypt from "bcrypt"
import Jwt from "jsonwebtoken"
import { UserEntity } from '../User/Entity';
import UserRole from '../../../models/UserRole';
import { WorkPeriodEntity } from './Entity';
import { OrganizationEntity } from '../Organization/Entity';
import TableQueryParameters from '../../../models/TableQueryParameters';
import { EntityPropertyNotFoundError } from 'typeorm';
import WorkPeriod from '../../../models/WorkPeriod';
@JsonController("/work-period")
@Authorized(UserRole.ADMIN)
export default class {

    @Get()
    async getAll(@CurrentUser() currentUser: UserEntity, @QueryParams() { order, take, skip }: TableQueryParameters) {
        try {
            return await WorkPeriodEntity.findAndCount({
                where: { organization: { id: currentUser.organization.id } },
                order, take, skip
            })
        } catch (error) {
            if (error instanceof EntityPropertyNotFoundError) throw new BadRequestError("Invalid column name for sorting");
            else throw new InternalServerError("Internal Server Error")
        }
    }

    @Post()
    async create(@CurrentUser() currentUser: UserEntity, @Body() { periodDate }: WorkPeriod) {
        const existing = await WorkPeriodEntity.findOneBy({
            period: periodDate,
            organization: { id: currentUser.organization.id }
        })
        if (existing !== null) throw new HttpError(409, "Period already exists")
        await WorkPeriodEntity.create({
            organization: currentUser.organization,
            period: periodDate
        }).save()
        return "Done"
    }
}