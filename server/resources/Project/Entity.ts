import EntityBase from "../../EntityBase"
import { Entity, Column, BaseEntity, PrimaryColumn, JoinColumn, ManyToOne } from "typeorm"
import { CustomerEntity } from "../Customer/Entity"

@Entity("project")
export class ProjectEntity extends EntityBase {

    @ManyToOne(() => CustomerEntity)
    @JoinColumn()
    customer: CustomerEntity

    @Column()
    name: string

    @Column()
    startDate: Date

    @Column()
    active: boolean



}