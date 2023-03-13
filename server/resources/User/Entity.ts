import { UserRole, UserStatus } from 'models'
import { Column, Entity, Index, ManyToOne, OneToMany } from 'typeorm'
import EntityBase from '~/EntityBase'
import OrganizationEntity from '~/resources/Organization/Entity'
import ClientUserEntity from '~/resources/relations/ClientResource'

@Entity('user')
@Index(['abbr', 'organization'], { unique: true })
export default class UserEntity extends EntityBase {
  @Column({ nullable: true })
  name: string

  @Column({ nullable: true })
  abbr: string

  @Column({ unique: true })
  email: string

  @Column({ nullable: true, select: false })
  passwordHash: string

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.END_USER,
  })
  role: UserRole

  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.PENDING,
  })
  status: UserStatus

  @Column({ default: true })
  isEnabled: boolean

  @Column({ type: 'timestamptz', nullable: true })
  startDate: Date

  @Column({ type: 'int2', nullable: true })
  hourlyRate: number

  @Column({ default: true })
  active: boolean

  @OneToMany(() => ClientUserEntity, clientUser => clientUser.user, {
    cascade: true,
  })
  clientUser: ClientUserEntity

  @ManyToOne(() => OrganizationEntity, { onDelete: 'CASCADE' })
  organization: OrganizationEntity
}
