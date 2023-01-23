import { HatEntity } from "@/server/resources/Hat/Entity"
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, JoinColumn, OneToOne } from "typeorm"

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