import UserRole from "models/User/UserRole"
import UserStatus from "models/User/UserStatus"
import EntityBase from "~/EntityBase"
import { OrganizationEntity } from "~/resources/Organization/Entity"
import { ResourceEntity } from "~/resources/Resource/Entity"
import { Entity, Column, ManyToOne, OneToOne } from "typeorm"



@Entity("user")
export class UserEntity extends EntityBase {

    @Column({ nullable: true })
    name: string

    @Column({ unique: true })
    email: string

    @Column({ nullable: true })
    passwordHash: string

    @Column({
        type: "enum",
        enum: UserRole,
        default: UserRole.END_USER
    })
    role: UserRole

    @Column({
        type: "enum",
        enum: UserStatus,
        default: UserStatus.PENDING
    })
    status: UserStatus

    @Column({ default: true })
    isEnabled: boolean

    @OneToOne(() => ResourceEntity)
    resource: ResourceEntity

    @ManyToOne(() => OrganizationEntity)
    organization: OrganizationEntity

}

