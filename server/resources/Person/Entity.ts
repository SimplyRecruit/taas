import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, JoinColumn, OneToOne } from "typeorm"
import { HatEntity } from "../Hat/Entity"

@Entity("person")
export class PersonEntity extends BaseEntity {
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