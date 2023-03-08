import { IsNotEmpty } from 'class-validator'
import TTBase from 'models/TimeTrack/TTBase'

export default class TTCreateBody extends TTBase {
  @IsNotEmpty()
  clientAbbr: string

  @IsNotEmpty()
  projectAbbr: string
}
