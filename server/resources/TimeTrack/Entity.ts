import EntityBase from "~/EntityBase"
import CustomerEntity from "~/resources/Customer/Entity"
import ProjectEntity from "~/resources/Project/Entity"
import ResourceEntity from "~/resources/Resource/Entity"
import { Entity, Column, JoinColumn, ManyToOne } from "typeorm"

@Entity("time_track")
export default class TimeTrackEntity extends EntityBase {

    @ManyToOne(() => ResourceEntity)
    @JoinColumn()
    resource: ResourceEntity

    @ManyToOne(() => CustomerEntity)
    @JoinColumn()
    customer: CustomerEntity

    @ManyToOne(() => ProjectEntity)
    @JoinColumn()
    project: ProjectEntity


    @Column({ type: "timestamptz" })
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