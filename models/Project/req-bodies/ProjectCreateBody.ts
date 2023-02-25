import { Allow } from 'class-validator'
import ProjectBase from 'models/Project/ProjectBase'
export default class ProjectCreateBody extends ProjectBase {
  @Allow()
  clientId: string
}
