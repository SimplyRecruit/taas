import { useEffect, useState } from 'react'
import { Button, Modal, Table } from 'antd'
import { FiEdit2 } from 'react-icons/fi'

import ClientsFilter from '@/pages/clients/components/ClientsFilter'
import { DEFAULT_ACTION_COLUMN_WIDTH } from '@/constants'

export default function Clients() {
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: '',
      key: 'action',
      width: DEFAULT_ACTION_COLUMN_WIDTH,
      render: () => (
        <span>
          <FiEdit2 type="edit" style={{ cursor: 'pointer' }} />
        </span>
      ),
    },
  ]

  const data = [
    {
      key: 1,
      name: 'John Doe',
      address: '1234 Main St.',
      status: 'active',
    },
    {
      key: 2,
      name: 'Jane Doe',
      address: '5678 Elm St.',
      status: 'inactive',
    },
  ]
  const [modalOpen, setModalOpen] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [filteredData, setFilteredData] = useState(data)
  const [selectedStatus, setSelectedStatus] = useState('active')

  const handleStatusChange = (value: string) => {
    setSelectedStatus(value)
    filterData(value, searchText)
  }

  const handleSearch = (value: string) => {
    setSearchText(value)
    filterData(selectedStatus, value)
  }

  useEffect(() => {
    filterData(selectedStatus, searchText)
  }, [])

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
        <ClientsFilter
          onStatusChange={handleStatusChange}
          onSearch={handleSearch}
          searchText={searchText}
        />
        <Button type="primary" onClick={() => setModalOpen(true)}>
          Add Client
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
        title="Add Client"
        open={modalOpen}
        onOk={() => setModalOpen(false)}
        onCancel={() => setModalOpen(false)}
      >
        {/* Add form inputs to capture new client data */}
      </Modal>
    </div>
  )
}
