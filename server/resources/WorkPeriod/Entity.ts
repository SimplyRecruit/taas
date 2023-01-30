import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm"
import OrganizationEntity from "~/resources/Organization/Entity"

@Entity("work_period")
export default class WorkPeriodEntity extends BaseEntity {

    @PrimaryColumn({ type: "timestamptz" })
    period: Date

    @Column({ default: false })
    closed: boolean

    @ManyToOne(() => OrganizationEntity, { onDelete: 'CASCADE' })
    @JoinColumn()
    organization: OrganizationEntity

}