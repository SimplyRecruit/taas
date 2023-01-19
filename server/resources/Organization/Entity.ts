import { Entity, Column, OneToMany } from "typeorm"
import EntityBase from "../../EntityBase"
import { ResourceEntity } from "../Resource/Entity"
import { UserEntity } from "../User/Entity"
import { CustomerEntity } from "../Customer/Entity"
import { WorkPeriodEntity } from "../WorkPeriod/Entity"

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