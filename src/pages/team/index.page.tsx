import type { GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { Button, Table } from 'antd'
import { useEffect, useState } from 'react'
import { FiEdit2 } from 'react-icons/fi'
import EditMemberDrawer from '@/pages/team/components/EditMemberDrawer'
import { Resource } from 'models'
import useApi from '@/services/useApi'
import { formatDate } from '@/util'
import TeamFilter from '@/pages/team/components/TeamFilter'
import { DEFAULT_ACTION_COLUMN_WIDTH } from '@/constants'
import { ColumnsType } from 'antd/es/table'

export default function Team() {
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
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
    },
    {
      title: 'Hourly rate',
      dataIndex: 'hourlyRate',
      key: 'hourlyRate',
      width: 150,
      render: (value: number) => (
        <div style={{ textAlign: 'right' }}>{value}</div>
      ),
    },
    {
      title: 'Start date',
      dataIndex: 'startDate',
      key: 'startDate',
      render: (value: Date) => <span>{formatDate(value)}</span>,
    },
    {
      title: '',
      key: 'action',
      fixed: 'right',
      width: DEFAULT_ACTION_COLUMN_WIDTH,
      render: (record: Resource) => (
        <FiEdit2
          style={{ cursor: 'pointer' }}
          onClick={() => {
            setCurrentRecord(record)
            setSelectedRowKey(record.id)
            setInviteMemberModalOpen(true)
          }}
        />
      ),
    },
  ]

  const { data: resources, loading, error, call } = useApi('resource', 'getAll')

  useEffect(() => {
    call()
  }, [])

  useEffect(() => {
    setData(resources)
    filterData(selectedStatus, searchText)
  }, [resources])

  const [inviteMemberModalOpen, setInviteMemberModalOpen] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [filteredData, setFilteredData] = useState<Resource[]>([])
  const [data, setData] = useState<Resource[]>([])
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [currentRecord, setCurrentRecord] = useState<Resource | null>(null)
  const [selectedRowKey, setSelectedRowKey] = useState<string | null>(null)

  const find = (record: Resource): number => {
    return data.findIndex(x => x.id === record.id)
  }

  const handleStatusChange = (value: string) => {
    setSelectedStatus(value)
    filterData(value, searchText)
  }

  const handleSearch = (value: string) => {
    setSearchText(value)
    filterData(selectedStatus, value)
  }

  const onUpdate = (record: Resource) => {
    const index = find(record)
    if (index != -1) {
      data[index] = record
      setData([...data])
      filterData(selectedStatus, searchText)
    }
    setInviteMemberModalOpen(false)
    setSelectedRowKey(null)
  }
  const onAdd = (record: Resource) => {
    setData([record, ...data])
    setFilteredData([record, ...filteredData])
    setInviteMemberModalOpen(false)
  }

  const filterData = (status: string, search: string) => {
    let filtered = data
    if (status !== 'all') {
      filtered = filtered.filter(item => item.active === (status === 'active'))
    }
    if (search) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(search.toLowerCase())
      )
    }
    setFilteredData(filtered)
  }

  return (
    <div style={{ padding: 20 }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 20,
        }}
      >
        <TeamFilter
          onStatusChange={handleStatusChange}
          onSearch={handleSearch}
          searchText={searchText}
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
          showTotal: total => `Total ${total} clients`,
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
      />
    </div>
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
