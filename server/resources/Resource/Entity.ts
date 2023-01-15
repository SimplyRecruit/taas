import { UserEntity } from "../User/Entity"
import { Entity, Column, PrimaryColumn, OneToOne, JoinColumn, ManyToOne } from "typeorm"
import EntityBaseOnlyDates from "../../EntityBaseOnlyDates"
import { OrganizationEntity } from "../Organization/Entity"

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

    @OneToOne(() => UserEntity)
    @JoinColumn()
    user: UserEntity

    @ManyToOne(() => OrganizationEntity)
    @JoinColumn()
    organization: OrganizationEntity
}