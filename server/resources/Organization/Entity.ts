import UserRole from "../../../models/UserRole"
import { Entity, Column, OneToMany } from "typeorm"
import EntityBase from "../../EntityBase"
import { ResourceEntity } from "../Resource/Entity"
import { UserEntity } from "../User/Entity"

@Entity("organization")
export class OrganizationEntity extends EntityBase {

    @Column()
    name: string

    @OneToMany(() => UserEntity, user => user.organization)
    users: UserEntity[]
}