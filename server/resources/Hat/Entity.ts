import { BaseEntity, Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm"
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