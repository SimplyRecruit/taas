import { useState } from 'react'
import { Button, Input, Modal, Select, Space, Table } from 'antd'
import moment from 'dayjs'
import { SearchOutlined } from '@ant-design/icons'
import { dummyData } from '@/pages/projects/data'
import ActiveActionMenu from '@/pages/projects/components/ActiveActionMenu'
import ArchivedActionMenu from '@/pages/projects/components/ArchivedActionMenu'
import EditProjectModal from '@/pages/projects/components/EditProjectModal'
import Project from 'models/Project'

export default function ProjectsPage() {
  const actionColumnWidth = 60
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
      width: actionColumnWidth,
      render: (record: Project) =>
        record.active ? (
          <ActiveActionMenu
            onEdit={() => {
              setCurrentRecord(record)
              setModalOpen(true)
            }}
            onArchive={() => {
              return null
            }}
          />
        ) : (
          <ArchivedActionMenu
            onEdit={() => {
              setCurrentRecord(record)
              setModalOpen(true)
            }}
            onRestore={() => {
              return null
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
        <Space size="small">
          <Select
            defaultValue="all"
            style={{ width: 120 }}
            onChange={handleStatusChange}
          >
            <Select.Option value="all">All</Select.Option>
            <Select.Option value="active">Active</Select.Option>
            <Select.Option value="inactive">Inactive</Select.Option>
          </Select>
          <Input
            prefix={<SearchOutlined />}
            allowClear
            placeholder="Search Name"
            value={searchText}
            onChange={e => handleSearch(e.target.value)}
            style={{ width: 200 }}
          />
        </Space>
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
