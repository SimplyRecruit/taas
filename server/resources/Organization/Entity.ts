import { Entity, Column, OneToMany } from "typeorm"
import EntityBase from "~/EntityBase"
import ResourceEntity from "~/resources/Resource/Entity"
import UserEntity from "~/resources/User/Entity"
import CustomerEntity from "~/resources/Customer/Entity"
import WorkPeriodEntity from "~/resources/WorkPeriod/Entity"

@Entity("organization")
export default class OrganizationEntity extends EntityBase {

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