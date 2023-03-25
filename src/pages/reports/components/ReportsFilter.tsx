import { Card, DatePicker, Divider, Space } from 'antd'
import DropdownAutocomplete from '@/components/DropdownAutocomplete'
import useApi from '@/services/useApi'
import { useEffect, useState } from 'react'
import {
  defaultRangePreset,
  rangePresets,
} from '@/pages/reports/components/constants'
import { ReportReqBody, UserRole } from 'models'
import { getUserFromCookies } from '@/auth/utils/AuthUtil'

interface RenderProps {
  onFilter: (values: ReportReqBody) => void
}

export default function ReportsFilter({ onFilter }: RenderProps) {
  const {
    data: clients,
    call: getAllClients,
    loading: loadingClientGetAll,
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

  const [userRole, setUserRole] = useState<UserRole>()
  const [selectedResources, setSelectedResources] = useState<string[]>([])
  const [selectedClients, setSelectedClients] = useState<string[]>([])
  const [selectedProjects, setSelectedProjects] = useState<string[]>([])
  const [selectedStatus, setSelectedStatus] = useState<string[]>([])
  const [dates, setDates] = useState<Date[]>(
    defaultRangePreset.map(e => e.toDate())
  )
  useEffect(() => {
    const role: UserRole = getUserFromCookies().role
    setUserRole(role)
    if (role != UserRole.END_USER) getAllResources({ entityStatus: 'all' })
    getAllClients({ entityStatus: 'all' })
    getAllProjects({ entityStatus: 'all' })
  }, [])

  useEffect(() => {
    onFilter(
      ReportReqBody.create({
        from: dates[0],
        to: dates[1],
        userIds: selectedResources,
        clientIds: selectedClients,
        projectIds: selectedProjects,
      })
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    selectedResources,
    selectedProjects,
    selectedClients,
    selectedStatus,
    dates,
  ])

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
      }}
    >
      <Card size="small" bodyStyle={{ padding: 0 }}>
        <Space split={<Divider type="vertical" />}>
          {userRole != UserRole.END_USER && (
            <DropdownAutocomplete
              badgeCount={selectedResources.length}
              onChange={e => setSelectedResources(e)}
              title="Team"
              options={resources?.map(e => ({ value: e.id, label: e.abbr }))}
              disabled={loadingResourceGetAll}
            />
          )}
          <DropdownAutocomplete
            badgeCount={selectedClients.length}
            onChange={e => setSelectedClients(e)}
            title="Client"
            options={clients?.map(e => ({ value: e.id, label: e.abbr }))}
            disabled={loadingClientGetAll}
          />
          <DropdownAutocomplete
            badgeCount={selectedProjects.length}
            onChange={e => setSelectedProjects(e)}
            title="Project"
            options={projects?.map(e => ({ value: e.id, label: e.abbr }))}
            disabled={loadingProjectGetAll}
          />
          <DropdownAutocomplete
            badgeCount={selectedStatus.length}
            onChange={e => setSelectedStatus(e)}
            searchable={false}
            title="Billable"
            options={[
              { label: 'Billable', value: 'billable' },
              { label: 'Not billable', value: 'notBillable' },
            ]}
          />
        </Space>
      </Card>
      <DatePicker.RangePicker
        allowClear={false}
        presets={rangePresets}
        defaultValue={defaultRangePreset}
        onChange={values => {
          if (values) {
            setDates([values[0]!.toDate(), values[1]!.toDate()])
          }
        }}
      />
    </div>
  )
}
