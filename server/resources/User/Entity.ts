import { UserRole, UserStatus } from 'models'
import { Column, Entity, ManyToOne, OneToOne } from 'typeorm'
import EntityBase from '~/EntityBase'
import OrganizationEntity from '~/resources/Organization/Entity'
import ResourceEntity from '~/resources/Resource/Entity'

@Entity('user')
export default class UserEntity extends EntityBase {
  @Column({ nullable: true })
  name: string

  @Column({ unique: true })
  email: string

  @Column({ nullable: true })
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

  @OneToOne(() => ResourceEntity)
  resource: ResourceEntity

  @ManyToOne(() => OrganizationEntity, { onDelete: 'CASCADE' })
  organization: OrganizationEntity
}
