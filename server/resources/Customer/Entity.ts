import CustomerContractType from "../../../models/CustomerContractType"
import { Entity, Column, PrimaryColumn } from "typeorm"
import EntityBaseOnlyDates from "../../EntityBaseOnlyDates"

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

    @Column()
    partnerName: string

    @Column({ default: true })
    active: boolean

}