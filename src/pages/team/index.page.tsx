import type { GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { Button, Table } from 'antd'
import { useEffect, useState } from 'react'
import EditMemberDrawer from '@/pages/team/components/EditMemberDrawer'
import { Resource, ResourceUpdateBody } from 'models'
import useApi from '@/services/useApi'
import { formatDate } from '@/util'
import { DEFAULT_ACTION_COLUMN_WIDTH } from '@/constants'
import { ColumnsType } from 'antd/es/table'
import TableActionColumn from '@/components/TableActionColumn'
import Filter from '@/components/Filter'

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
        <TableActionColumn
          isActive={record.active}
          onEdit={() => {
            setCurrentRecord(record)
            setSelectedRowKey(record.id)
            setInviteMemberModalOpen(true)
          }}
          onArchive={() => setResourceStatus(false, record)}
          onRestore={() => setResourceStatus(true, record)}
          onDelete={() => null}
        />
      ),
    },
  ]

  const { data, loading, call, setData } = useApi('resource', 'getAll', [])
  const { loading: loadingUpdate, call: update } = useApi('resource', 'update')

  const [inviteMemberModalOpen, setInviteMemberModalOpen] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [filteredData, setFilteredData] = useState<Resource[]>([])
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [currentRecord, setCurrentRecord] = useState<Resource | null>(null)
  const [selectedRowKey, setSelectedRowKey] = useState<string | null>(null)

  const find = (record: Resource): number => {
    return data.findIndex(x => x.id === record.id)
  }

  const onUpdate = (record: Resource) => {
    const index = find(record)
    if (index != -1) {
      data[index] = record
      setData([...data])
    }
    setInviteMemberModalOpen(false)
    setSelectedRowKey(null)
  }
  const onAdd = (record: Resource) => {
    setData([record, ...data])
    setFilteredData([record, ...filteredData])
    setInviteMemberModalOpen(false)
  }
  async function setResourceStatus(isActive: boolean, record: Resource) {
    try {
      await update(ResourceUpdateBody.createPartially({ active: isActive }), {
        id: record.id,
      })
      record.active = isActive
      setData([...data!])
    } catch (error) {
      console.log(error)
    }
  }

  const filterData = (data: Resource[]) => {
    let filtered = data
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(
        item => item.active === (selectedStatus === 'active')
      )
    }
    if (searchText) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchText.toLowerCase())
      )
    }
    setFilteredData(filtered)
  }
  useEffect(() => {
    filterData(data)
  }, [data, setSearchText, selectedStatus])

  useEffect(() => {
    call()
  }, [])

  return (
    <>
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
          defaultStatus="all"
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
