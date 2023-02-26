import { DEFAULT_DATE_FORMAT } from '@/constants'
import moment from 'dayjs'
export function formatDate(date: Date): string {
  return date ? moment(date).format(DEFAULT_DATE_FORMAT) : ''
}
export function stringToDate(value: string): Date {
  return moment(value, 'DD/MM/YYYY').toDate()
}

export function momentToDate(date: moment.Dayjs) {
  return date.toDate()
}
