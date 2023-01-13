import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany, JoinColumn, OneToOne } from "typeorm"
import { PersonEntity } from "../Person/Entity"

@Entity("hat")
export class HatEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    color!: string

    @OneToOne(() => PersonEntity)
    person!: PersonEntity
}