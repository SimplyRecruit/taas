import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm'
import EntityBaseOnlyDates from '~/EntityBaseOnlyDates'
import CustomerEntity from '~/resources/Customer/Entity'

@Entity('project')
export default class ProjectEntity extends EntityBaseOnlyDates {
  @PrimaryColumn()
  id: string

  @ManyToOne(() => CustomerEntity)
  @JoinColumn()
  customer: CustomerEntity

  @Column()
  name: string

  @Column({ type: 'timestamptz' })
  startDate: Date

  @Column({ default: true })
  active: boolean
}
