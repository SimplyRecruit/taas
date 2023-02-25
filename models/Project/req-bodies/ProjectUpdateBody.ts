import { Allow, IsBoolean } from 'class-validator'
import ProjectBase from 'models/Project/ProjectBase'
export default class ProjectUpdateBody extends ProjectBase {
  @Allow()
  clientId: string

  @IsBoolean()
  active: boolean
}
