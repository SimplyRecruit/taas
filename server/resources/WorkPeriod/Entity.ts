import {
  BaseEntity,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm'
import OrganizationEntity from '~/resources/Organization/Entity'

@Entity('work_period')
export default class WorkPeriodEntity extends BaseEntity {
  @PrimaryColumn({ type: 'date' })
  period: Date

  @ManyToOne(() => OrganizationEntity, { onDelete: 'CASCADE' })
  @JoinColumn()
  organization: OrganizationEntity
}
