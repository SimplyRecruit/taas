import { Entity, Column, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm"
import EntityBaseOnlyDates from "../../EntityBaseOnlyDates"
import { CustomerEntity } from "../Customer/Entity"
import { ResourceEntity } from "../Resource/Entity"

@Entity("customer_resource")
export class CustomerResourceEntity extends EntityBaseOnlyDates {

    @PrimaryColumn({ name: 'customer_id' })
    customerId: string

    @PrimaryColumn({ name: 'resource_id' })
    resourceId: string

    @ManyToOne(() => CustomerEntity, customer => customer.customerResource, { onDelete: 'CASCADE' })
    customer: CustomerEntity

    @ManyToOne(() => ResourceEntity, resource => resource.customerResource, { onDelete: 'CASCADE' })
    resource: ResourceEntity

    @Column({ default: true })
    active: boolean
}