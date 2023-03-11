import { Badge, Checkbox, DatePicker, Divider, Popover, Space } from 'antd'
import dayjs from 'dayjs'
import type { Dayjs } from 'dayjs'
import DropdownAutocomplete from '@/pages/reports/components/DropdownAutocomplete'
import DropdownActivator from '@/components/DropdownActivator'
import useApi from '@/services/useApi'
import { useEffect, useState } from 'react'
import rangePresets from '@/pages/reports/components/constants'
import { ReportReqBody } from 'models'
import { momentToDate } from '@/util'

interface RenderProps {
  onChange: (values: ReportReqBody) => void
}

export default function ReportsFilter({ onChange }: RenderProps) {
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

  useEffect(() => {
    getAllResources()
    getAllClients()
    getAllProjects()
  }, [])
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <div>
        <Space split={<Divider type="vertical" />}>
          <DropdownAutocomplete
            onChange={e => setSelectedResources(e)}
            title="Team"
            options={resources?.map(e => ({ value: e.id, label: e.abbr }))}
            badgeCount={selectedResources.length}
          />

          <DropdownAutocomplete
            onChange={e => setSelectedClients(e)}
            title="Client"
            options={clients?.map(e => ({ value: e.id, label: e.abbr }))}
            badgeCount={selectedClients.length}
          />
          <DropdownAutocomplete
            onChange={e => setSelectedProjects(e)}
            title="Project"
            options={projects?.map(e => ({ value: e.id, label: e.abbr }))}
            badgeCount={selectedProjects.length}
          />
          <DropdownAutocomplete
            onChange={e => setSelectedStatus(e)}
            searchable={false}
            title="Billable"
            options={[
              { label: 'Billable', value: 'billable' },
              { label: 'Not billable', value: 'notBillable' },
            ]}
            badgeCount={selectedStatus.length}
          ></DropdownAutocomplete>
        </Space>
      </div>
      <DatePicker.RangePicker
        presets={rangePresets}
        defaultValue={rangePresets[3].value}
        onChange={values =>
          values
            ? onChange(
                ReportReqBody.create({
                  from: momentToDate(values[0]),
                  to: momentToDate(values[1]),
                  resourceIds: selectedResources,
                  clientIds: selectedClients,
                  projectIds: selectedProjects,
                })
              )
            : null
        }
      />
    </div>
  )
}
