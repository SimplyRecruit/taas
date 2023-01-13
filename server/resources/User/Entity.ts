import UserRole from "../../../models/UserRole"
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, JoinColumn, OneToOne } from "typeorm"
import EntityBase from "../../EntityBase"

@Entity("user")
export class UserEntity extends EntityBase {

    @Column({ nullable: true })
    name: string

    @Column({ unique: true })
    email: string

    @Column()
    passwordHash: string

    @Column({
        type: "enum",
        enum: UserRole,
        default: UserRole.EMPLOYEE
    })
    role: UserRole

}