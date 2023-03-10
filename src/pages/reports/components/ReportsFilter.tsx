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
          <DropdownAutocomplete title="Team" />
          <DropdownAutocomplete title="Client" />
          <DropdownAutocomplete title="Project" />
          <Popover
            trigger="click"
            content={
              <Space direction="vertical">
                <Checkbox>Billable</Checkbox>
                <Checkbox>Not billable</Checkbox>
              </Space>
            }
          >
            <DropdownActivator title="Status" />
          </Popover>
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
