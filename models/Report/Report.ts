import Model from 'models/common/Model'

export default class Report extends Model {
  date: Date
  billable: boolean
  totalHours: number
}
