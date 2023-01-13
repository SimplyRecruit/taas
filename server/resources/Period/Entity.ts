import { Entity, Column, BaseEntity, PrimaryColumn } from "typeorm"

@Entity("work_period")
export class WorkPeriodEntity extends BaseEntity {

    @PrimaryColumn()
    period: Date

    @Column({ default: false })
    closed: boolean

}