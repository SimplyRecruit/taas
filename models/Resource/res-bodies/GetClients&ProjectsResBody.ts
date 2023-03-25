import ClientRelation from 'models/Client/ClientRelation'
import Model from 'models/Model'
import Project from 'models/Project/Project'

export default class GetClientsAndProjectsResBody extends Model {
  clients: ClientRelation[]
  projects: Project[]
}
