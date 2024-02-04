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
import { useTranslation } from 'next-i18next'
import { sortOptionTypeByLabel } from '@/util'

interface RenderProps {
  onFilter: (values: ReportReqBody) => void
}

export default function ReportsFilter({ onFilter }: RenderProps) {
  const { t } = useTranslation('reports')
  const {
    data: allClients,
    call: getAllClients,
    loading: loadingGetAllClients,
  } = useApi('client', 'getAll')
  const {
    data: resources,
    call: getAllResources,
    loading: loadingGetAllResources,
  } = useApi('resource', 'getAll')
  const {
    data: allProjects,
    call: getAllProjects,
    loading: loadingGetAllProjects,
  } = useApi('project', 'getAll')

  const {
    data: clientsAndProjects,
    call: getClientsAndProjects,
    loading: loadingGetClientsAndProjects,
  } = useApi('resource', 'getClientsAndProjects')

  const {
    call: getPartnerNames,
    data: partnerNames,
    loading: loadingGetPartnerNames,
  } = useApi('client', 'getUniquePartnerNames')

  const [isEndUser, setIsEndUser] = useState(true)
  const [selectedResources, setSelectedResources] = useState<string[]>([])
  const [selectedClients, setSelectedClients] = useState<string[]>([])
  const [selectedProjects, setSelectedProjects] = useState<string[]>([])
  const [selectedStatus, setSelectedStatus] = useState<string[]>([])
  const [selectedPartnerNames, setSelectedPartner] = useState<string[]>([])

  const [dates, setDates] = useState<Date[]>(
    defaultRangePreset.map(e => e.toDate())
  )

  const clients = isEndUser
    ? clientsAndProjects?.clients.map(e => ({ value: e.id, label: e.abbr }))
    : allClients?.map(e => ({ value: e.id, label: e.abbr }))

  const projects = isEndUser
    ? clientsAndProjects?.projects.map(e => ({ value: e.id, label: e.abbr }))
    : allProjects?.map(e => ({ value: e.id, label: e.abbr }))

  useEffect(() => {
    const role: UserRole = getUserFromCookies().role
    setIsEndUser(role == UserRole.END_USER)

    if (role != UserRole.END_USER) {
      getAllResources({ entityStatus: 'all' })
      getAllClients({ entityStatus: 'all' })
      getAllProjects({ entityStatus: 'all' })
    } else {
      getClientsAndProjects({ id: 'me' })
    }

    getPartnerNames()
  }, [])

  useEffect(() => {
    onFilter(
      ReportReqBody.create({
        from: dates[0],
        to: dates[1],
        userIds: selectedResources,
        clientIds: selectedClients,
        projectIds: selectedProjects,
        partnerNames: selectedPartnerNames,
      })
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    selectedResources,
    selectedProjects,
    selectedClients,
    selectedStatus,
    selectedPartnerNames,
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
          {!isEndUser && (
            <DropdownAutocomplete
              badgeCount={selectedResources.length}
              onChange={e => setSelectedResources(e)}
              title={t('filter.team')}
              options={resources
                ?.map(e => ({ value: e.id, label: e.name }))
                .sort(sortOptionTypeByLabel)}
              disabled={loadingGetAllResources}
            />
          )}
          <DropdownAutocomplete
            badgeCount={selectedClients.length}
            onChange={e => setSelectedClients(e)}
            title={t('filter.client')}
            options={clients?.sort(sortOptionTypeByLabel)}
            disabled={loadingGetAllClients || loadingGetClientsAndProjects}
          />
          <DropdownAutocomplete
            badgeCount={selectedProjects.length}
            onChange={e => setSelectedProjects(e)}
            title={t('filter.project')}
            options={projects?.sort(sortOptionTypeByLabel)}
            disabled={loadingGetAllProjects || loadingGetClientsAndProjects}
          />
          <DropdownAutocomplete
            badgeCount={selectedPartnerNames.length}
            onChange={e => setSelectedPartner(e)}
            title="Partner"
            options={(partnerNames as string[])
              ?.filter(e => !!e)
              .map(e => ({ value: e, label: e }))
              .sort(sortOptionTypeByLabel)}
            disabled={loadingGetPartnerNames}
          />
          <DropdownAutocomplete
            badgeCount={selectedStatus.length}
            onChange={e => setSelectedStatus(e)}
            searchable={false}
            title={t('filter.billable')}
            options={[
              { label: t('filter.billable'), value: 'billable' },
              { label: t('filter.notBillable'), value: 'notBillable' },
            ]}
          />
        </Space>
      </Card>
      <DatePicker.RangePicker
        allowClear={false}
        presets={rangePresets.map(preset => ({
          ...preset,
          label: t('filter.' + preset.label),
        }))}
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
