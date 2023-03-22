import { Matches } from 'class-validator'
import Model from 'models/Model'

const regex = /^(0?[0-9]|1[01])\/(20\d{2})$/

export default class WorkPeriod extends Model {
  @Matches(regex)
  private period: string

  public static fromDate(period: Date) {
    const instance = new this()
    instance.period =
      `${period.getMonth()}`.padStart(2, '0') + `/${period.getFullYear()}`
    return instance
  }
  get periodDate() {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion, @typescript-eslint/no-unused-vars
    const [_, month, year] = this.period.match(regex)!
    return new Date(Number.parseInt(year), Number.parseInt(month))
  }

  get periodString() {
    return this.period
  }
}
