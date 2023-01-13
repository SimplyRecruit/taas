import { Entity, Column, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm"
import EntityBaseOnlyDates from "../../EntityBaseOnlyDates"
import { CustomerEntity } from "../Customer/Entity"
import { ResourceEntity } from "../Resource/Entity"

@Entity("customer_resource")
export class CustomerResourceEntity extends EntityBaseOnlyDates {

    @PrimaryColumn({ name: 'customer_id' })
    @ManyToOne(() => CustomerEntity)
    @JoinColumn()
    customer: CustomerEntity

    @PrimaryColumn({ name: 'resource_id' })
    @ManyToOne(() => ResourceEntity)
    @JoinColumn()
    resource: ResourceEntity

    @Column()
    active: boolean
}