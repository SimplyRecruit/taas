import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryColumn,
} from 'typeorm'
import EntityBaseOnlyDates from '~/EntityBaseOnlyDates'
import CustomerResourceEntity from '~/resources/relations/CustomerResource'
import UserEntity from '~/resources/User/Entity'

@Entity('resource')
export default class ResourceEntity extends EntityBaseOnlyDates {
  @PrimaryColumn()
  id: string

  @Column({ type: 'timestamptz' })
  startDate: Date

  @Column({ type: 'int2' })
  hourlyRate: number

  @Column({ default: true })
  active: boolean

  @OneToOne(() => UserEntity, { onDelete: 'CASCADE', cascade: true })
  @JoinColumn()
  user: UserEntity

  @OneToMany(
    () => CustomerResourceEntity,
    customerResource => customerResource.resource
  )
  customerResource: CustomerResourceEntity
}
