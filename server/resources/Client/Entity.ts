import { ClientContractType } from 'models'
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm'
import EntityBase from '~/EntityBase'
import OrganizationEntity from '~/resources/Organization/Entity'
import ClientUserEntity from '~/resources/relations/ClientResource'

@Entity('client')
@Index(['abbr', 'organization'], { unique: true })
export default class ClientEntity extends EntityBase {
  @Column()
  name: string

  @Column()
  abbr: string

  @Column({ type: 'timestamptz' })
  startDate: Date

  @Column({ type: 'timestamptz', nullable: true })
  contractDate: Date | null

  @Column({
    type: 'enum',
    enum: ClientContractType,
  })
  contractType: ClientContractType

  @Column({ nullable: true })
  partnerName: string

  @Column({ default: true })
  active: boolean

  @ManyToOne(() => OrganizationEntity, { onDelete: 'CASCADE' })
  @JoinColumn()
  organization: OrganizationEntity

  @OneToMany(() => ClientUserEntity, clientUser => clientUser.client, {
    cascade: true,
  })
  clientUser: ClientUserEntity[]
}
