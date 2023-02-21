import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm'
import EntityBaseOnlyDates from '~/EntityBaseOnlyDates'
import ClientEntity from '~/resources/Client/Entity'

@Entity('project')
export default class ProjectEntity extends EntityBaseOnlyDates {
  @PrimaryColumn()
  id: string

  @ManyToOne(() => ClientEntity)
  @JoinColumn()
  client: ClientEntity

  @Column()
  name: string

  @Column({ type: 'timestamptz' })
  startDate: Date

  @Column({ default: true })
  active: boolean
}
