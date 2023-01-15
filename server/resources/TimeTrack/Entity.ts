import EntityBase from "../../EntityBase"
import { Entity, Column, JoinColumn, ManyToOne } from "typeorm"
import { CustomerEntity } from "../Customer/Entity"
import { ProjectEntity } from "../Project/Entity"
import { ResourceEntity } from "../Resource/Entity"

@Entity("time_track")
export class TimeTrackEntity extends EntityBase {

    @ManyToOne(() => ResourceEntity)
    @JoinColumn()
    resource: ResourceEntity

    @ManyToOne(() => CustomerEntity)
    @JoinColumn()
    customer: CustomerEntity

    @ManyToOne(() => ProjectEntity)
    @JoinColumn()
    project: ProjectEntity


    @Column()
    date: Date

    @Column({ type: "decimal", precision: 1 })
    hour: number

    @Column()
    description: string

    @Column()
    billable: boolean

    @Column()
    ticketNo: string


}