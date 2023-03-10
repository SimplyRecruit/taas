import { Checkbox, DatePicker, Divider, Popover, Space } from 'antd'
import dayjs from 'dayjs'
import type { Dayjs } from 'dayjs'
import DropdownAutocomplete from '@/pages/reports/components/DropdownAutocomplete'
import DropdownActivator from '@/components/DropdownActivator'

interface RenderProps {
  getReport: (values: any) => void
}

export default function ReportsFilter({ getReport }: RenderProps) {
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
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <div>
        <Space split={<Divider type="vertical" />}>
          <DropdownAutocomplete
            options={[
              { label: 'Apple', value: 'Apple' },
              { label: 'Pear', value: 'Pear' },
              { label: 'Orange', value: 'Orange' },
            ]}
            title="Team"
          />
          <DropdownAutocomplete title="Client" />
          <DropdownAutocomplete title="Project" />
          <DropdownAutocomplete
            searchable={false}
            title="Billable"
            options={[
              { label: 'Billable', value: 'billable' },
              { label: 'Not billable', value: 'notBillable' },
            ]}
          ></DropdownAutocomplete>
        </Space>
      </div>
      <DatePicker.RangePicker
        presets={rangePresets}
        defaultValue={rangePresets[3].value}
        onChange={getReport}
      />
    </div>
  )
}
