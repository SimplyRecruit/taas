import { Checkbox, DatePicker, Divider, Popover, Space } from 'antd'
import dayjs from 'dayjs'
import type { Dayjs } from 'dayjs'
import DropdownAutocomplete from '@/pages/reports/components/DropdownAutocomplete'
import DropdownActivator from '@/components/DropdownActivator'
import useApi from '@/services/useApi'
import { useEffect } from 'react'
import rangePresets from '@/pages/reports/components/constants'

interface RenderProps {
  getReport: (values: any) => void
}

export default function ReportsFilter({ getReport }: RenderProps) {
  const {
    data: clients,
    call: getAllClients,
    loading,
  } = useApi('client', 'getAll')
  const {
    data: resources,
    call: getAllResources,
    loading: loadingResourceGetAll,
  } = useApi('resource', 'getAll')
  const {
    data: projects,
    call: getAllProjects,
    loading: loadingProjectGetAll,
  } = useApi('project', 'getAll')

  useEffect(() => {
    getAllProjects()
    getAllResources()
    getAllClients()
  }, [])
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <div>
        <Space split={<Divider type="vertical" />}>
          <DropdownAutocomplete
            title="Team"
            options={resources?.map(e => ({ value: e.abbr, label: e.abbr }))}
          />
          <DropdownAutocomplete
            title="Client"
            options={clients?.map(e => ({ value: e.abbr, label: e.abbr }))}
          />
          <DropdownAutocomplete
            title="Project"
            options={projects?.map(e => ({ value: e.abbr, label: e.abbr }))}
          />
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
