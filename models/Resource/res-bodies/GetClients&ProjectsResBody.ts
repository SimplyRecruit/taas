import ClientRelation from 'models/Client/ClientRelation'
import Model from 'models/common/Model'
import ProjectRelation from 'models/Project/ProjectRelation'

export default class GetClientsAndProjectsResBody extends Model {
  clients: ClientRelation[]
  projects: ProjectRelation[]
}
