import { Entity, Column, OneToMany } from "typeorm"
import EntityBase from "@/server/EntityBase"
import { ResourceEntity } from "@/server/resources/Resource/Entity"
import { UserEntity } from "@/server/resources/User/Entity"
import { CustomerEntity } from "@/server/resources/Customer/Entity"
import { WorkPeriodEntity } from "@/server/resources/WorkPeriod/Entity"

@Entity("organization")
export class OrganizationEntity extends EntityBase {

    @Column()
    name: string

    @OneToMany(() => UserEntity, user => user.organization)
    users: UserEntity[]

    @OneToMany(() => ResourceEntity, resource => resource.organization)
    resources: ResourceEntity[]

    @OneToMany(() => CustomerEntity, customer => customer.organization)
    customers: CustomerEntity[]

    @OneToMany(() => WorkPeriodEntity, workPeriod => workPeriod.organization)
    workPeriods: WorkPeriodEntity[]
}