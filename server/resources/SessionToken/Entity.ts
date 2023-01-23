import EntityBase from "@/server/EntityBase"
import { CustomerEntity } from "@/server/resources/Customer/Entity"
import { ProjectEntity } from "@/server/resources/Project/Entity"
import { ResourceEntity } from "@/server/resources/Resource/Entity"
import { UserEntity } from "@/server/resources/User/Entity"
import { Entity, Column, JoinColumn, ManyToOne, BaseEntity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm"

@Entity("session_token")
export class SessionTokenEntity extends BaseEntity {

    @ManyToOne(() => UserEntity)
    user: UserEntity

    @PrimaryColumn()
    userId: string

    @Column()
    tokenHash: string

    @Column({ type: "timestamptz" })
    expiration: Date

}