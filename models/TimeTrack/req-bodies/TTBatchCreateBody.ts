import { stringToDate } from '@/util'
import { Type } from 'class-transformer'
import { IsArray, validate, ValidateNested } from 'class-validator'
import Model from 'models/common/Model'
import TimelessDate from 'models/common/TimelessDate'
import TTCreateBody from 'models/TimeTrack/req-bodies/TTCreateBody'
import 'reflect-metadata'

const rowDelimiter = '\n'
const valueDelimiter = '\t'

export default class TTBatchCreateBody extends Model {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TTCreateBody)
  bodies: TTCreateBody[]

  static async parse(text: string) {
    const rows = text.trim().split(rowDelimiter)
    const bodies: TTCreateBody[] = []
    for (const row of rows) {
      const values = row.split(valueDelimiter)
      if (values.length !== 7) throw 'parsing-error'
      const [
        dateString,
        clientAbbr,
        hourString,
        description,
        billableString,
        ticketNo,
        projectAbbr,
      ] = values
      const date = stringToDate(dateString).toISOString() as unknown as Date
      const hour = Number(hourString)
      if (
        billableString.toUpperCase() !== 'YES' &&
        billableString.toUpperCase() !== 'NO'
      )
        throw 'parsing-error'
      const billable = billableString === 'YES'
      bodies.push(
        TTCreateBody.create({
          date: TimelessDate.fromDate(date),
          clientAbbr,
          hour,
          description,
          billable,
          ticketNo,
          projectAbbr,
        })
      )
    }
    const parsed = this.create({ bodies })
    const errors = await validate(parsed)
    if (errors.length) throw 'parsing-error'
    return parsed
  }
}
