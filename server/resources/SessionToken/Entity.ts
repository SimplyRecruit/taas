import { BaseEntity, Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm'
import UserEntity from '~/resources/User/Entity'

@Entity('session_token')
export default class SessionTokenEntity extends BaseEntity {
  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  user: UserEntity

  @PrimaryColumn()
  userId: string

  @Column()
  tokenHash: string

  @Column({ type: 'timestamptz' })
  expiration: Date
}
