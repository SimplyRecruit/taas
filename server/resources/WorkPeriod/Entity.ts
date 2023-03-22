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
  @PrimaryColumn({ type: 'varchar', length: 7 })
  period: string

  @ManyToOne(() => OrganizationEntity, { onDelete: 'CASCADE' })
  @JoinColumn()
  organization: OrganizationEntity
}
