import { Allow } from 'class-validator'
import TTBase from 'models/TimeTrack/TTBase'

export default class TTCreateBody extends TTBase {
  @Allow()
  clientId: string

  @Allow()
  projectId: string
}
