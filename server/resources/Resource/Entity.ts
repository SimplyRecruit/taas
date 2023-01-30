import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryColumn } from "typeorm"
import EntityBaseOnlyDates from "~/EntityBaseOnlyDates"
import OrganizationEntity from "~/resources/Organization/Entity"
import CustomerResourceEntity from "~/resources/relations/CustomerResource"
import UserEntity from "~/resources/User/Entity"

@Entity("resource")
export default class ResourceEntity extends EntityBaseOnlyDates {

    @PrimaryColumn()
    id: string

    @Column()
    name: string

    @Column({ type: "timestamptz" })
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