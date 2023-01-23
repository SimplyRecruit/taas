import EntityBaseOnlyDates from "@/server/EntityBaseOnlyDates"
import { CustomerEntity } from "@/server/resources/Customer/Entity"
import { ResourceEntity } from "@/server/resources/Resource/Entity"
import { Entity, Column, ManyToOne, PrimaryColumn } from "typeorm"

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