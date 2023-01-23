import EntityBaseOnlyDates from "@/server/EntityBaseOnlyDates"
import { OrganizationEntity } from "@/server/resources/Organization/Entity"
import { CustomerResourceEntity } from "@/server/resources/relations/CustomerResource"
import { UserEntity } from "@/server/resources/User/Entity"
import { Entity, Column, PrimaryColumn, OneToOne, JoinColumn, ManyToOne, OneToMany } from "typeorm"

@Entity("resource")
export class ResourceEntity extends EntityBaseOnlyDates {

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