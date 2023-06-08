import dayjs from 'dayjs'
import type { Dayjs } from 'dayjs'
import type { ColumnConfig } from '@ant-design/plots/es/components/column'
const rangePresets: {
  label: string
  value: [Dayjs, Dayjs]
}[] = [
  { label: 'today', value: [dayjs().startOf('day'), dayjs().endOf('day')] },
  {
    label: 'yesterday',
    value: [
      dayjs().subtract(1, 'day').startOf('day'),
      dayjs().subtract(1, 'day').endOf('day'),
    ],
  },
  {
    label: 'thisWeek',
    value: [dayjs().startOf('week'), dayjs().endOf('week')],
  },
  {
    label: 'lastWeek',
    value: [
      dayjs().subtract(1, 'week').startOf('week'),
      dayjs().subtract(1, 'week').endOf('week'),
    ],
  },
  {
    label: 'last2Weeks',
    value: [dayjs().subtract(1, 'week').startOf('week'), dayjs().endOf('week')],
  },
  {
    label: 'thisMonth',
    value: [dayjs().startOf('month'), dayjs().endOf('month')],
  },
  {
    label: 'lastMonth',
    value: [
      dayjs().subtract(1, 'month').startOf('month'),
      dayjs().subtract(1, 'month').endOf('month'),
    ],
  },
  {
    label: 'thisYear',
    value: [dayjs().startOf('year'), dayjs().endOf('year')],
  },
  {
    label: 'lastYear',
    value: [
      dayjs().subtract(1, 'year').startOf('year'),
      dayjs().subtract(1, 'year').endOf('year'),
    ],
  },
]

const defaultRangePreset = rangePresets[2].value

const baseConfig = {
  color: ['#8BC34A', '#AED581'],
  isStack: true,
  xField: 'date',
  yField: 'totalHours',
  seriesField: 'billable',
  label: {
    layout: [
      {
        type: 'interval-adjust-position',
      },
      {
        type: 'interval-hide-overlap',
      },
      {
        type: 'adjust-color',
      },
    ],
  },
} satisfies Partial<ColumnConfig>

export { rangePresets, defaultRangePreset, baseConfig }
