import EntityBase from "@/server/EntityBase"
import { CustomerEntity } from "@/server/resources/Customer/Entity"
import { ProjectEntity } from "@/server/resources/Project/Entity"
import { ResourceEntity } from "@/server/resources/Resource/Entity"
import { Entity, Column, JoinColumn, ManyToOne } from "typeorm"

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