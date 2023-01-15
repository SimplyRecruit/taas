import EntityBaseOnlyDates from "../../EntityBaseOnlyDates"
import { Entity, Column, PrimaryColumn, JoinColumn, ManyToOne } from "typeorm"
import { CustomerEntity } from "../Customer/Entity"

@Entity("project")
export class ProjectEntity extends EntityBaseOnlyDates {

    @PrimaryColumn()
    id: string

    @ManyToOne(() => CustomerEntity)
    @JoinColumn()
    customer: CustomerEntity

    @Column()
    name: string

    @Column()
    startDate: Date

    @Column({ default: true })
    active: boolean



}