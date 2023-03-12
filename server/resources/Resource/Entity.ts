import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm'
import EntityBase from '~/EntityBase'
import ClientResourceEntity from '~/resources/relations/ClientResource'
import UserEntity from '~/resources/User/Entity'

@Entity('resource')
export default class ResourceEntity extends EntityBase {
  @Column({ type: 'timestamptz' })
  startDate: Date

  @Column({ type: 'int2' })
  hourlyRate: number

  @Column({ default: true })
  active: boolean

  @Column({ nullable: true })
  userId: string

  @OneToOne(() => UserEntity, { onDelete: 'CASCADE', cascade: true })
  @JoinColumn()
  user: UserEntity

  @OneToMany(
    () => ClientResourceEntity,
    clientResource => clientResource.resource,
    { cascade: true }
  )
  clientResource: ClientResourceEntity
}
