import { useState } from 'react'
import { Button, Input, Modal, Select, Space, Table } from 'antd'
import { FiEdit2 } from 'react-icons/fi'
import { SearchOutlined } from '@ant-design/icons'
import ChangeRateModal from '@/pages/team/components/ChangeRateModal'
import { dummyData } from '@/pages/projects/data'
import ActionMenu from '@/components/ActionMenu'

export default function ProjectsPage() {
  const roles = ['Admin', 'Manager', 'End-user']
  const actionColumnWidth = 60
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: any) => (
        <span
          style={{
            textDecoration:
              record.status === 'inactive' ? 'line-through' : 'none',
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
    },
    {
      title: '',
      key: 'action',
      width: actionColumnWidth,
      render: () => <ActionMenu />,
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
      filtered = filtered.filter(item => item.status === status)
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
        <Button type="primary" onClick={() => setModalOpen(true)}>
          Add Project
        </Button>
      </div>
      <Table
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
      <Modal
        title="Add Project"
        open={modalOpen}
        onOk={() => setModalOpen(false)}
        onCancel={() => setModalOpen(false)}
      >
        {/* Add form inputs to capture new client data */}
      </Modal>
    </div>
  )
}
