import UserRole from "@/models/UserRole"
import EntityBase from "@/server/EntityBase"
import { OrganizationEntity } from "@/server/resources/Organization/Entity"
import { ResourceEntity } from "@/server/resources/Resource/Entity"
import { Entity, Column, ManyToOne, OneToOne } from "typeorm"

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

    @ManyToOne(() => OrganizationEntity)
    organization: OrganizationEntity

}