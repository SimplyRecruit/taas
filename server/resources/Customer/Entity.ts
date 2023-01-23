import CustomerContractType from "../../../models/CustomerContractType"
import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn, OneToMany } from "typeorm"
import EntityBaseOnlyDates from "../../EntityBaseOnlyDates"
import { OrganizationEntity } from "../Organization/Entity"
import { CustomerResourceEntity } from "../relations/CustomerResource"

@Entity("customer")
export class CustomerEntity extends EntityBaseOnlyDates {

    @PrimaryColumn()
    id: string

    @Column()
    name: string

    @Column({ type: "timestamptz" })
    startDate: Date

    @Column({ type: "timestamptz" })
    contractDate: Date

    @Column({
        type: "enum",
        enum: CustomerContractType,
    })
    contractType: CustomerContractType

    @Column()
    partnerName: string

    @Column({ default: true })
    active: boolean

    @ManyToOne(() => OrganizationEntity)
    @JoinColumn()
    organization: OrganizationEntity

    @OneToMany(() => CustomerResourceEntity, customerResource => customerResource.customer)
    customerResource: CustomerResourceEntity

}