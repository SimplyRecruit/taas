import type { GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useState } from 'react'
import { Button, Table } from 'antd'
import moment from 'dayjs'
import { dummyData } from '@/pages/projects/data'
import ActiveActionMenu from '@/pages/projects/components/ActiveActionMenu'
import ArchivedActionMenu from '@/pages/projects/components/ArchivedActionMenu'
import EditProjectModal from '@/pages/projects/components/EditProjectModal'
import { Project } from 'models'
import Filter from '@/components/Filter'
import { DEFAULT_ACTION_COLUMN_WIDTH } from '@/constants'

export default function ProjectsPage() {
  const columns = [
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
      render: (a: moment.Dayjs) => {
        return <div>{a.format('DD/MM/YYYY').toString()}</div>
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
              setData([...data])
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
              setData([...data])
            }}
            onDelete={() => {
              return null
            }}
          />
        ),
    },
  ]

  const [modalOpen, setModalOpen] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [filteredData, setFilteredData] = useState(dummyData)
  const [data, setData] = useState(dummyData)
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [currentRecord, setCurrentRecord] = useState(
    dummyData[0] ? dummyData[0] : null
  )

  const handleStatusChange = (value: string) => {
    setSelectedStatus(value)
    filterData(value, searchText)
  }

  const handleSearch = (value: string) => {
    setSearchText(value)
    filterData(selectedStatus, value)
  }

  const filterData = (status: string, search: string) => {
    let filtered = data
    if (status !== 'all') {
      filtered = filtered.filter(item => item.active === (status == 'active'))
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
        key={currentRecord?.id}
        open={modalOpen}
        project={currentRecord}
        onCancel={() => setModalOpen(false)}
        onAdd={e => {
          setData([...data, e])
          setFilteredData([e, ...filteredData])
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
      ...(await serverSideTranslations(locale, [])),
    },
  }
}