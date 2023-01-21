import { Entity, Column, BaseEntity, PrimaryColumn, ManyToOne, JoinColumn } from "typeorm"
import { OrganizationEntity } from "../Organization/Entity"

@Entity("work_period")
export class WorkPeriodEntity extends BaseEntity {

    @PrimaryColumn({ type: "timestamptz" })
    period: Date

    @Column({ default: false })
    closed: boolean

    @ManyToOne(() => OrganizationEntity, { onDelete: 'CASCADE' })
    @JoinColumn()
    organization: OrganizationEntity

}