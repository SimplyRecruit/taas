import { BaseEntity, CreateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"

export default class extends BaseEntity {

    @PrimaryGeneratedColumn("uuid")
    id: string

    @CreateDateColumn({ type: "timestamptz" })
    createdAt: Date

    @UpdateDateColumn({ type: "timestamptz" })
    updatedAt: Date

    @DeleteDateColumn({ type: "timestamptz" })
    deletedAt: Date

}