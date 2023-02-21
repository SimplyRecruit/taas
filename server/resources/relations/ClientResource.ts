import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm'
import EntityBaseOnlyDates from '~/EntityBaseOnlyDates'
import ClientEntity from '~/resources/Client/Entity'
import ResourceEntity from '~/resources/Resource/Entity'

@Entity('client_resource')
export default class ClientResourceEntity extends EntityBaseOnlyDates {
  @PrimaryColumn({ name: 'client_id' })
  clientId: string

  @PrimaryColumn({ name: 'resource_id' })
  resourceId: string

  @ManyToOne(() => ClientEntity, client => client.clientResource, {
    onDelete: 'CASCADE',
  })
  client: ClientEntity

  @ManyToOne(() => ResourceEntity, resource => resource.clientResource, {
    onDelete: 'CASCADE',
  })
  resource: ResourceEntity

  @Column({ default: true })
  active: boolean
}
