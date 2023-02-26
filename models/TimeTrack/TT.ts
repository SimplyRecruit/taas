import { Client, Project } from 'models'
import TTBase from 'models/TimeTrack/TTBase'

export default class TT extends TTBase {
  id: string
  client: Client
  project: Project
}
