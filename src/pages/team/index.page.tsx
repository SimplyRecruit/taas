import type { GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { Badge, Button, message, Space, Table, Tag, Typography } from 'antd'
import { useEffect, useMemo, useState } from 'react'
import EditMemberDrawer from '@/pages/team/components/EditMemberDrawer'
import { Resource, ResourceUpdateBody, UserRole, UserStatus } from 'models'
import useApi from '@/services/useApi'
import { DEFAULT_ACTION_COLUMN_WIDTH } from '@/constants'
import { ColumnsType } from 'antd/es/table'
import Filter from '@/components/Filter'
import DateCell from '@/components/DateCell'
import useColor from '@/styles/useColor'
import TeamTableActionColumn from '@/pages/team/components/TeamTableActionColumn'

function getUserRoleTagColor(value: UserRole) {
  switch (value) {
    case UserRole.ADMIN:
      return 'magenta'
    case UserRole.TT_MANAGER:
      return 'orange'
    default:
      return 'processing'
  }
}
export default function Team() {
  const { getColor } = useColor()
  const columns: ColumnsType<Resource> = [
    {
      title: 'Abbreviation',
      dataIndex: 'abbr',
      key: 'abbr',
      render: (text: string, record: Resource) => (
        <span
          style={{
            textDecoration: !record.active ? 'line-through' : 'none',
          }}
        >
          {text}
        </span>
      ),
      sorter: (a, b) => a.abbr.localeCompare(b.abbr),
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: Resource) => (
        <span
          style={{
            textDecoration: !record.active ? 'line-through' : 'none',
          }}
        >
          {text}
        </span>
      ),
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      sorter: (a, b) => a.email.localeCompare(b.email),
      render: (email: string, resource: Resource) => {
        if (resource.status === UserStatus.PENDING)
          return (
            <Space>
              <span>{email}</span>
              <Badge color={getColor('orange')} />
              <Typography.Text type="warning">Pending invite</Typography.Text>
            </Space>
          )
        return <span>{email}</span>
      },
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      sorter: (a, b) => a.role.localeCompare(b.role),
      render: (value: UserRole) => (
        <Tag color={getUserRoleTagColor(value)}>{value}</Tag>
      ),
    },
    {
      title: 'Hourly rate',
      dataIndex: 'hourlyRate',
      key: 'hourlyRate',
      width: 150,
      render: (_, resource: Resource) => {
        return <div style={{ textAlign: 'right' }}>{resource.hourlyRate}</div>
      },
      sorter: (a, b) => a.hourlyRate - b.hourlyRate,
    },
    {
      title: 'Start date',
      dataIndex: 'startDate',
      key: 'startDate',
      render: (value: Date) => <DateCell value={value} />,
      sorter: (a, b) =>
        new Date(a.startDate).valueOf() - new Date(b.startDate).valueOf(),
    },
    {
      title: '',
      key: 'action',
      fixed: 'right',
      width: DEFAULT_ACTION_COLUMN_WIDTH,
      render: (resource: Resource) => (
        <TeamTableActionColumn
          resource={resource}
          onSendEmail={() => onResendInvite(resource)}
          onEdit={() => {
            setCurrentRecord(resource)
            setSelectedRowKey(resource.id)
            setInviteMemberModalOpen(true)
          }}
          onArchive={() => setResourceStatus(false, resource)}
          onRestore={() => setResourceStatus(true, resource)}
        />
      ),
    },
  ]

  const {
    data,
    loading: loadingGetAll,
    call,
    setData,
  } = useApi('resource', 'getAll', [])
  const { loading: loadingUpdate, call: update } = useApi('resource', 'update')
  const { call: resendInvite } = useApi('user', 'reInviteMember')

  const [messageApi, contextHolder] = message.useMessage()
  const [inviteMemberModalOpen, setInviteMemberModalOpen] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('active')
  const [currentRecord, setCurrentRecord] = useState<Resource | null>(null)
  const [selectedRowKey, setSelectedRowKey] = useState<string | null>(null)

  const loading = loadingUpdate || loadingGetAll
  async function onResendInvite(resource: Resource) {
    setCurrentRecord(resource)
    try {
      await resendInvite({ abbr: resource.abbr })
      messageApi.success('Sent an invite e-mail to ' + resource.email + '.')
    } catch (error) {
      messageApi.error('Could not sent the invite e-mail. Please try again.')
    }
    setCurrentRecord(null)
  }
  const filteredData = useMemo(() => {
    let filtered = data
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(
        item => item.active === (selectedStatus == 'active')
      )
    }
    if (searchText) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchText.toLowerCase())
      )
    }
    return filtered
  }, [data, searchText, selectedStatus])

  function find(record: Resource): number {
    return data.findIndex(x => x.id === record.id)
  }

  function onUpdate(record: Resource) {
    const index = find(record)
    if (index != -1) {
      data[index] = record
      setData(prev => [...prev])
    }
    setInviteMemberModalOpen(false)
    setSelectedRowKey(null)
    messageApi.success('Team member updated successfully!')
  }

  function onAdd(record: Resource) {
    setData(prev => [record, ...prev])
    setInviteMemberModalOpen(false)
    messageApi.success('Team member invited successfully!')
  }

  async function setResourceStatus(isActive: boolean, record: Resource) {
    try {
      await update(ResourceUpdateBody.createPartially({ active: isActive }), {
        id: record.id,
      })
      record.active = isActive
      setData(prev => [...prev])
      messageApi.success(
        isActive
          ? 'Team member restored successfully!'
          : 'Team member archived successfully!'
      )
    } catch (error) {
      messageApi.error(
        isActive
          ? 'An error occured. Could not restore team member.'
          : 'An error occured. Could not archive team member.'
      )
    }
  }

  useEffect(() => {
    call({ entityStatus: 'all' })
  }, [])

  return (
    <>
      {contextHolder}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 20,
        }}
      >
        <Filter
          onStatusChange={setSelectedStatus}
          onSearch={setSearchText}
          searchText={searchText}
          searchPlaceholder="Search by name"
        />
        <Button
          type="primary"
          onClick={() => {
            setCurrentRecord(null)
            setInviteMemberModalOpen(true)
          }}
        >
          Invite Member
        </Button>
      </div>
      <Table
        scroll={{ x: 'max-content', y: 'calc(100vh - 320px)' }}
        rowKey={record => record.id}
        rowClassName={record => {
          if (selectedRowKey == record.id) {
            return 'ant-table-row-selected'
          }
          return ''
        }}
        loading={loading}
        columns={columns}
        dataSource={filteredData}
        pagination={{
          position: ['bottomCenter'],
          responsive: true,
          showQuickJumper: false,
          showLessItems: true,
          showTotal: total => `Total ${total} members`,
          showSizeChanger: true,
        }}
      />
      <EditMemberDrawer
        value={currentRecord}
        open={inviteMemberModalOpen}
        onCancel={() => {
          setInviteMemberModalOpen(false)
          setSelectedRowKey(null)
        }}
        onUpdate={onUpdate}
        onAdd={onAdd}
        onError={() =>
          messageApi.error(
            currentRecord
              ? 'An error occured. Could not update team member'
              : 'An error occured. Could not add team member'
          )
        }
      />
    </>
  )
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  locale ??= 'en'
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  }
}
