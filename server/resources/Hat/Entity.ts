import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToOne } from "typeorm"
import { PersonEntity } from "@/server/resources/Person/Entity"

@Entity("hat")
export class HatEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    color!: string

    @OneToOne(() => PersonEntity)
    person!: PersonEntity
}