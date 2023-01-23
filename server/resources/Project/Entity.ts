import EntityBaseOnlyDates from "@/server/EntityBaseOnlyDates"
import { CustomerEntity } from "@/server/resources/Customer/Entity"
import { Entity, Column, PrimaryColumn, JoinColumn, ManyToOne } from "typeorm"

@Entity("project")
export class ProjectEntity extends EntityBaseOnlyDates {

    @PrimaryColumn()
    id: string

    @ManyToOne(() => CustomerEntity)
    @JoinColumn()
    customer: CustomerEntity

    @Column()
    name: string

    @Column({ type: "timestamptz" })
    startDate: Date

    @Column({ default: true })
    active: boolean



}