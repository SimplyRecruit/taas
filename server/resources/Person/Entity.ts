import { BaseEntity, Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm"
import HatEntity from "~/resources/Hat/Entity"

@Entity("person")
export default class PersonEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    name!: string

    @Column()
    surname!: string

    @OneToOne(() => HatEntity)
    @JoinColumn()
    hat!: HatEntity
}