import UserRole from "../../../models/UserRole"
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, JoinColumn, OneToOne } from "typeorm"
import EntityBase from "../../EntityBase"
import { ResourceEntity } from "../Resource/Entity"
import { OrganizationEntity } from "../Organization/Entity"

@Entity("user")
export class UserEntity extends EntityBase {

    @Column({ nullable: true })
    name: string

    @Column({ unique: true })
    email: string

    @Column()
    passwordHash: string

    @Column({
        type: "enum",
        enum: UserRole,
        default: UserRole.END_USER
    })
    role: UserRole

    @OneToOne(() => ResourceEntity)
    resource: ResourceEntity

    @ManyToOne(() => OrganizationEntity, organization => organization.users)
    organization: OrganizationEntity

}