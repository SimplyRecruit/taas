import { UserEntity } from "../User/Entity"
import { Entity, Column, PrimaryColumn, OneToOne, JoinColumn, ManyToOne, OneToMany } from "typeorm"
import EntityBaseOnlyDates from "../../EntityBaseOnlyDates"
import { OrganizationEntity } from "../Organization/Entity"
import { CustomerResourceEntity } from "../relations/CustomerResource"

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

    @Column({ default: true })
    active: boolean

    @OneToOne(() => UserEntity, { onDelete: 'CASCADE' })
    @JoinColumn()
    user: UserEntity

    @ManyToOne(() => OrganizationEntity, { onDelete: 'CASCADE' })
    @JoinColumn()
    organization: OrganizationEntity

    @OneToMany(() => CustomerResourceEntity, customerResource => customerResource.resource)
    customerResource: CustomerResourceEntity
}