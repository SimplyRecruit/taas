import { Entity, Column, PrimaryColumn } from "typeorm"
import EntityBaseOnlyDates from "../../EntityBaseOnlyDates"

@Entity("resource")
export class ResourceEntity extends EntityBaseOnlyDates {

    @PrimaryColumn()
    id: string

    @Column()
    name: string

    @Column()
    startDate: Date

    @Column({ type: "int2" })
    hourlyRate: number

    @Column()
    active: boolean
}