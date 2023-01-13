import CustomerContractType from "../../../models/CustomerContractType"
import { Entity, Column } from "typeorm"
import EntityBase from "../../EntityBase"

@Entity("customer")
export class CustomerEntity extends EntityBase {

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