import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm'
import EntityBase from '~/EntityBase'
import ClientEntity from '~/resources/Client/Entity'
import OrganizationEntity from '~/resources/Organization/Entity'

@Entity('project')
@Index(['abbr', 'organization'], { unique: true })
export default class ProjectEntity extends EntityBase {
  @Column()
  abbr: string

  @Column()
  name: string

  @Column()
  clientId: string

  @ManyToOne(() => ClientEntity)
  @JoinColumn()
  client: ClientEntity

  @Column({ type: 'timestamptz' })
  startDate: Date

  @ManyToOne(() => OrganizationEntity)
  @JoinColumn()
  organization: OrganizationEntity

  @Column({ default: true })
  active: boolean
}
