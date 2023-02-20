import { DEFAULT_DATE_FORMAT } from '@/constants'
import moment from 'dayjs'
export function formatDate(date: Date) {
  return date ? moment(date).format(DEFAULT_DATE_FORMAT) : ''
}

export function momentToDate(date: moment.Dayjs) {
  return date.toDate()
}
