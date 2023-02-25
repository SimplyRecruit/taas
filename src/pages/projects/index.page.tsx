import type { GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useEffect, useState } from 'react'
import { Button, Table } from 'antd'
import moment from 'dayjs'
import ActiveActionMenu from '@/pages/projects/components/ActiveActionMenu'
import ArchivedActionMenu from '@/pages/projects/components/ArchivedActionMenu'
import EditProjectModal from '@/pages/projects/components/EditProjectModal'
import { Project } from 'models'
import Filter from '@/components/Filter'
import { DEFAULT_ACTION_COLUMN_WIDTH } from '@/constants'
import useApi from '@/services/useApi'
import { formatDate } from '@/util'

export default function ProjectsPage() {
  const columns = [
    {
      title: 'Abbreviation',
      dataIndex: 'abbr',
      key: 'abbr',
      render: (text: string, record: Project) => (
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
      render: (text: string, record: Project) => (
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
      title: 'Client',
      dataIndex: 'client',
      key: 'client',
    },
    {
      title: 'Start Date',
      dataIndex: 'startDate',
      key: 'startDate',
      render: (date: Date) => {
        return <div>{formatDate(date)}</div>
      },
    },
    {
      title: '',
      key: 'action',
      width: DEFAULT_ACTION_COLUMN_WIDTH,
      render: (record: Project) =>
        record.active ? (
          <ActiveActionMenu
            onEdit={() => {
              setCurrentRecord(record)
              setModalOpen(true)
            }}
            onArchive={() => {
              record.active = false
              setData([...data!])
            }}
          />
        ) : (
          <ArchivedActionMenu
            onEdit={() => {
              setCurrentRecord(record)
              setModalOpen(true)
            }}
            onRestore={() => {
              record.active = true
              setData([...data!])
            }}
            onDelete={() => {
              return null
            }}
          />
        ),
    },
  ]

  const { data, call, setData, loading } = useApi('project', 'getAll')
  const [modalOpen, setModalOpen] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [filteredData, setFilteredData] = useState<Project[]>([])
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [currentRecord, setCurrentRecord] = useState<Project | null>(null)

  const handleStatusChange = (value: string) => {
    setSelectedStatus(value)
  }

  const handleSearch = (value: string) => {
    setSearchText(value)
  }

  const filterData = (data: Project[]) => {
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
    setFilteredData(filtered)
  }

  useEffect(() => {
    if (!data) return
    filterData(data)
  }, [data, searchText, selectedStatus])

  useEffect(() => {
    call()
  }, [])

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
        <Filter
          onSearch={handleSearch}
          onStatusChange={handleStatusChange}
          searchText={searchText}
          searchPlaceholder="Search by name"
        />
        <Button
          type="primary"
          onClick={() => {
            setCurrentRecord(null)
            setModalOpen(true)
          }}
        >
          Add Project
        </Button>
      </div>
      <Table
        rowKey="id"
        columns={columns}
        loading={loading}
        dataSource={filteredData}
        pagination={{
          position: ['bottomCenter'],
          responsive: true,
          showQuickJumper: false,
          showLessItems: true,
          showTotal: total => `Total ${total} clients`,
          showSizeChanger: false,
        }}
      />
      <EditProjectModal
        open={modalOpen}
        value={currentRecord}
        onCancel={() => setModalOpen(false)}
        onAdd={e => {
          setData([e, ...(data ?? [])])
          setModalOpen(false)
        }}
        onUpdate={() => {
          return null
        }}
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
