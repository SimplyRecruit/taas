import { Client } from 'models'

import ProjectBase from 'models/Project/ProjectBase'
export default class Project extends ProjectBase {
  id: string
  client: Client
  active: boolean
}
