import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToOne } from "typeorm"
import PersonEntity from "~/resources/Person/Entity"

@Entity("hat")
export default class HatEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    color!: string

    @OneToOne(() => PersonEntity)
    person!: PersonEntity
}