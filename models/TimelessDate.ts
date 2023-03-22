import { Matches } from 'class-validator'
import Model from 'models/Model'

const regex =
  /^(((\d{4}\/((0[13578]\/|1[02]\/)(0[1-9]|[12]\d|3[01])|(0[13456789]\/|1[012]\/)(0[1-9]|[12]\d|30)|02\/(0[1-9]|1\d|2[0-8])))|((([02468][048]|[13579][26])00|\d{2}([13579][26]|0[48]|[2468][048])))\/02\/29)){0,10}$/

export default class TimelessDate extends Model {
  @Matches(regex)
  private timelessDate: string

  public static fromDate(date: Date) {
    const instance = new this()
    instance.timelessDate =
      `${date.getFullYear()}/` +
      `${date.getMonth() + 1}`.padStart(2, '0') +
      '/' +
      `${date.getDate()}`.padStart(2, '0')
    console.log(instance.timelessDate)
    return instance
  }
  get dateObject() {
    const [year, month, day] = this.timelessDate.split('/')
    console.log(this.timelessDate, year, month, day)
    return new Date(
      Number.parseInt(year),
      Number.parseInt(month) - 1,
      Number.parseInt(day)
    )
  }

  get dateString() {
    return this.timelessDate
  }
}
