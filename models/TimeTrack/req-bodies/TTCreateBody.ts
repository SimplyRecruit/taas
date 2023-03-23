import { Type } from 'class-transformer'
import { ValidateNested } from 'class-validator'
import TimelessDate from 'models/TimelessDate'

import TTBase from 'models/TimeTrack/TTBase'
import 'reflect-metadata'

export default class TTCreateBody extends TTBase {
  @ValidateNested()
  @Type(() => TimelessDate)
  date: TimelessDate
}
