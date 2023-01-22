import CustomerContractType from "../../../models/CustomerContractType"
import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn } from "typeorm"
import EntityBaseOnlyDates from "../../EntityBaseOnlyDates"
import { OrganizationEntity } from "../Organization/Entity"

@Entity("customer")
export class CustomerEntity extends EntityBaseOnlyDates {

    @PrimaryColumn()
    id: string

    @Column()
    name: string

    @Column()
    startDate: Date

    @Column()
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

}