import EntityBase from "~/EntityBase"
import CustomerEntity from "~/resources/Customer/Entity"
import ProjectEntity from "~/resources/Project/Entity"
import ResourceEntity from "~/resources/Resource/Entity"
import UserEntity from "~/resources/User/Entity"
import { Entity, Column, JoinColumn, ManyToOne, BaseEntity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm"

@Entity("session_token")
export default class SessionTokenEntity extends BaseEntity {

    @ManyToOne(() => UserEntity)
    user: UserEntity

    @PrimaryColumn()
    userId: string

    @Column()
    tokenHash: string

    @Column({ type: "timestamptz" })
    expiration: Date

}