import dayjs from 'dayjs'
import type { Dayjs } from 'dayjs'

const rangePresets: {
  label: string
  value: [Dayjs, Dayjs]
}[] = [
  { label: 'Today', value: [dayjs(), dayjs()] },
  { label: 'Yesterday', value: [dayjs().add(-1, 'd'), dayjs()] },
  { label: 'This week', value: [dayjs().add(-7, 'd'), dayjs()] },
  { label: 'Last week', value: [dayjs().add(-7, 'd'), dayjs()] },
  { label: 'Past 2 weeks', value: [dayjs().add(-7, 'd'), dayjs()] },
  { label: 'This month', value: [dayjs().add(-14, 'd'), dayjs()] },
  { label: 'Last month', value: [dayjs().add(-30, 'd'), dayjs()] },
  { label: 'This year', value: [dayjs().add(-90, 'd'), dayjs()] },
  { label: 'Last year', value: [dayjs().add(-90, 'd'), dayjs()] },
]

const defaultRangePreset = rangePresets[3].value

export { rangePresets, defaultRangePreset }
