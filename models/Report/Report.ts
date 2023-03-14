import Model from 'models/Model'

export default class Report extends Model {
  date: Date
  billable: boolean
  totalHours: number
}
