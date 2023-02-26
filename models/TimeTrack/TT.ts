import { ClientRelation, Project } from 'models'
import TTBase from 'models/TimeTrack/TTBase'

export default class TT extends TTBase {
  id: string
  client: ClientRelation
  project: Project
}
