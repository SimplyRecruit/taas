import { Column, Entity, OneToMany } from 'typeorm'
import EntityBase from '~/EntityBase'
import ClientEntity from '~/resources/Client/Entity'
import UserEntity from '~/resources/User/Entity'
import WorkPeriodEntity from '~/resources/WorkPeriod/Entity'

@Entity('organization')
export default class OrganizationEntity extends EntityBase {
  @Column()
  name: string

  @OneToMany(() => UserEntity, user => user.organization)
  users: UserEntity[]

  @OneToMany(() => ClientEntity, client => client.organization)
  clients: ClientEntity[]

  @OneToMany(() => WorkPeriodEntity, workPeriod => workPeriod.organization)
  workPeriods: WorkPeriodEntity[]
}
