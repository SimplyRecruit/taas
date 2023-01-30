import EntityBaseOnlyDates from "~/EntityBaseOnlyDates"
import CustomerEntity from "~/resources/Customer/Entity"
import ResourceEntity from "~/resources/Resource/Entity"
import { Entity, Column, ManyToOne, PrimaryColumn } from "typeorm"

@Entity("customer_resource")
export default class CustomerResourceEntity extends EntityBaseOnlyDates {

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