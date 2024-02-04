import type { OptionType } from '@/components/DropdownAutocomplete'
import { DEFAULT_DATE_FORMAT } from '@/constants'
import moment from 'dayjs'
export function formatDate(date: Date | string): string {
  return date ? moment(date).format(DEFAULT_DATE_FORMAT) : '-'
}
export function stringToDate(value: string): Date {
  return moment(value, DEFAULT_DATE_FORMAT).toDate()
}

export function downloadFile(blob: Blob, fileName: string) {
  const aElement = document.createElement('a')
  aElement.setAttribute('download', fileName)
  const href = URL.createObjectURL(blob as any)
  aElement.href = href
  aElement.setAttribute('target', '_blank')
  aElement.click()
  URL.revokeObjectURL(href)
}

export function sortOptionTypeByLabel(a: OptionType, b: OptionType) {
  return a.label.localeCompare(b.label)
}
