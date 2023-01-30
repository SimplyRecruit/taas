import CustomerContractType from "models/CustomerContractType"
import EntityBaseOnlyDates from "~/EntityBaseOnlyDates"
import OrganizationEntity from "~/resources/Organization/Entity"
import CustomerResourceEntity from "~/resources/relations/CustomerResource"
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn } from "typeorm"


@Entity("customer")
export default class CustomerEntity extends EntityBaseOnlyDates {

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