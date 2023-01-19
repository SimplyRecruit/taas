import LoginReqBody from '../../../models/LoginReqBody';
import { Body, Get, Post, JsonController, UnauthorizedError, CurrentUser, InternalServerError } from 'routing-controllers';
import Bcrypt from "bcrypt"
import Jwt from "jsonwebtoken"
import { UserEntity } from '../User/Entity';
import UserRole from 'models/UserRole';
import { WorkPeriodEntity } from './Entity';
import { OrganizationEntity } from '../Organization/Entity';
@JsonController("/work-period")
export default class {

    @Get()
    async getAll(@CurrentUser() currentUser: UserEntity) {
        if (currentUser.role !== UserRole.ADMIN) throw new UnauthorizedError()
        return await OrganizationEntity.find({
            select: { workPeriods: true },
            where: { id: currentUser.organization.id },
            relations: { workPeriods: true }
        })
    }
}