import { Type } from 'class-transformer'
import { IsNotEmpty, ValidateNested } from 'class-validator'
import TimelessDate from 'models/TimelessDate'

import TTBase from 'models/TimeTrack/TTBase'
import 'reflect-metadata'

export default class TTCreateBody extends TTBase {
  @IsNotEmpty()
  clientAbbr: string

  @IsNotEmpty()
  projectAbbr: string

  @ValidateNested()
  @Type(() => TimelessDate)
  date: TimelessDate
}
