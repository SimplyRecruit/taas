import { DEFAULT_DATE_FORMAT } from '@/constants'
import moment from 'dayjs'
export function dateToMoment(date: Date) {
  return moment(date).format(DEFAULT_DATE_FORMAT)
}
