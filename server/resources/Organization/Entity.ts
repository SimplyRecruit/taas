import { Column, Entity, OneToMany } from 'typeorm'
import EntityBase from '~/EntityBase'
import CustomerEntity from '~/resources/Customer/Entity'
import ResourceEntity from '~/resources/Resource/Entity'
import UserEntity from '~/resources/User/Entity'
import WorkPeriodEntity from '~/resources/WorkPeriod/Entity'

@Entity('organization')
export default class OrganizationEntity extends EntityBase {
  @Column()
  name: string

  @OneToMany(() => UserEntity, user => user.organization)
  users: UserEntity[]

  @OneToMany(() => CustomerEntity, customer => customer.organization)
  customers: CustomerEntity[]

  @OneToMany(() => WorkPeriodEntity, workPeriod => workPeriod.organization)
  workPeriods: WorkPeriodEntity[]
}
