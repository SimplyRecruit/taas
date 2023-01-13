import { Entity, Column, BaseEntity, PrimaryColumn } from "typeorm"
import EntityBase from "../../EntityBase"

@Entity("work_period")
export class WorkPeriodEntity extends BaseEntity {

    @PrimaryColumn()
    @Column()
    period: Date

    @Column({ default: false })
    closed: boolean

}