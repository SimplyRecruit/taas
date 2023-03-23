import { Type } from 'class-transformer'
import { ValidateNested } from 'class-validator'
import TimelessDate from 'models/TimelessDate'
import TTBase from 'models/TimeTrack/TTBase'

export default class TTUpdateBody extends TTBase {
  @ValidateNested()
  @Type(() => TimelessDate)
  date: TimelessDate
}
