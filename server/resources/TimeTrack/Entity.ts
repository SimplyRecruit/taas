import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import EntityBase from '~/EntityBase'
import ClientEntity from '~/resources/Client/Entity'
import ProjectEntity from '~/resources/Project/Entity'
import UserEntity from '~/resources/User/Entity'

@Entity('time_track')
export default class TimeTrackEntity extends EntityBase {
  @ManyToOne(() => UserEntity)
  @JoinColumn()
  user: UserEntity

  @ManyToOne(() => ClientEntity)
  @JoinColumn()
  client: ClientEntity

  @ManyToOne(() => ProjectEntity)
  @JoinColumn()
  project: ProjectEntity

  @Column({ type: 'date' })
  date: Date

  @Column()
  hour: number

  @Column()
  description: string

  @Column()
  billable: boolean

  @Column()
  ticketNo: string
}
