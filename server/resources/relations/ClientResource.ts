import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm'
import EntityBaseOnlyDates from '~/EntityBaseOnlyDates'
import ClientEntity from '~/resources/Client/Entity'
import UserEntity from '~/resources/User/Entity'

@Entity('client_user')
export default class ClientUserEntity extends EntityBaseOnlyDates {
  @PrimaryColumn({ name: 'client_id' })
  clientId: string

  @PrimaryColumn({ name: 'user_id' })
  userId: string

  @ManyToOne(() => ClientEntity, client => client.clientUser, {
    onDelete: 'CASCADE',
  })
  client: ClientEntity

  @ManyToOne(() => UserEntity, user => user.clientUser, {
    onDelete: 'CASCADE',
  })
  user: UserEntity

  @Column({ default: true })
  active: boolean
}
