import { Badge, Checkbox, DatePicker, Divider, Popover, Space } from 'antd'
import dayjs from 'dayjs'
import type { Dayjs } from 'dayjs'
import DropdownAutocomplete from '@/pages/reports/components/DropdownAutocomplete'
import DropdownActivator from '@/components/DropdownActivator'
import useApi from '@/services/useApi'
import { useEffect, useState } from 'react'
import {
  defaultRangePreset,
  rangePresets,
} from '@/pages/reports/components/constants'
import { ReportReqBody } from 'models'
import { momentToDate } from '@/util'

interface RenderProps {
  onFilter: (values: ReportReqBody) => void
}

export default function ReportsFilter({ onFilter }: RenderProps) {
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

  const [selectedResources, setSelectedResources] = useState<string[]>([])
  const [selectedClients, setSelectedClients] = useState<string[]>([])
  const [selectedProjects, setSelectedProjects] = useState<string[]>([])
  const [selectedStatus, setSelectedStatus] = useState<string[]>([])
  const [dates, setDates] = useState<Date[]>(
    defaultRangePreset.map(e => momentToDate(e))
  )

  useEffect(() => {
    getAllResources()
    getAllClients()
    getAllProjects()
  }, [])

  useEffect(() => {
    onFilter(
      ReportReqBody.create({
        from: dates[0],
        to: dates[1],
        resourceIds: selectedResources,
        clientIds: selectedClients,
        projectIds: selectedProjects,
      })
    )
  }, [
    selectedResources,
    selectedProjects,
    selectedClients,
    selectedStatus,
    dates,
  ])

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <div>
        <Space split={<Divider type="vertical" />}>
          <DropdownAutocomplete
            onSave={e => setSelectedResources(e)}
            title="Team"
            options={resources?.map(e => ({ value: e.id, label: e.abbr }))}
          />

          <DropdownAutocomplete
            onSave={e => setSelectedClients(e)}
            title="Client"
            options={clients?.map(e => ({ value: e.id, label: e.abbr }))}
          />
          <DropdownAutocomplete
            onSave={e => setSelectedProjects(e)}
            title="Project"
            options={projects?.map(e => ({ value: e.id, label: e.abbr }))}
          />
          <DropdownAutocomplete
            onSave={e => setSelectedStatus(e)}
            searchable={false}
            title="Billable"
            options={[
              { label: 'Billable', value: 'billable' },
              { label: 'Not billable', value: 'notBillable' },
            ]}
          />
        </Space>
      </div>
      <DatePicker.RangePicker
        allowClear={false}
        presets={rangePresets}
        defaultValue={defaultRangePreset}
        onChange={values => {
          if (values) {
            setDates([momentToDate(values[0]!), momentToDate(values[1]!)])
          }
        }}
      />
    </div>
  )
}
