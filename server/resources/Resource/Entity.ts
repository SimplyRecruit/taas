import { Entity, Column } from "typeorm"
import EntityBase from "../../EntityBase"

@Entity("resource")
export class ResourceEntity extends EntityBase {

    @Column()
    name: string

    @Column()
    startDate: Date

    @Column({ type: "int2" })
    hourlyRate: number

    @Column()
    active: boolean
}