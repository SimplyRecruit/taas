import { useState } from 'react'
import { Button, Input, Modal, Select, Space, Table } from 'antd'
import { FiEdit2 } from 'react-icons/fi'
import { SearchOutlined } from '@ant-design/icons'
import ChangeRateModal from '@/pages/team/components/ChangeRateModal'

export default function Team() {
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
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Hourly Rate',
      dataIndex: 'hourlyRate',
      key: 'hourlyRate',
      render: (value: number, record: any) => (
        <>
          {value}
          <Button
            type="link"
            style={{ marginLeft: 10 }}
            onClick={() => {
              setCurrentRecord(record)
              setChangeRateModalOpen(true)
            }}
          >
            Change
          </Button>
        </>
      ),
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role: string, record: any) => (
        <Select
          value={role}
          onChange={value => handleRoleChange(record, value)}
        >
          {roles.map(r => (
            <Select.Option value={r} key={r}>
              {r}
            </Select.Option>
          ))}
        </Select>
      ),
    },
    {
      title: '',
      key: 'action',
      width: actionColumnWidth,
      render: () => (
        <span>
          <FiEdit2 type="edit" style={{ cursor: 'pointer' }} />
        </span>
      ),
    },
  ]

  const dummyData = [
    {
      key: 0,
      name: 'John Doe',
      email: 'johndoe@example.com',
      hourlyRate: 50,
      role: 'Developer',
      status: 'active',
    },
    {
      key: 1,
      name: 'Jane Doe',
      email: 'janedoe@example.com',
      hourlyRate: 60,
      role: 'Designer',
      status: 'inactive',
    },
  ]
  const [modalOpen, setModalOpen] = useState(false)
  const [changeRateModalOpen, setChangeRateModalOpen] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [filteredData, setFilteredData] = useState(dummyData)
  const [data, setData] = useState(dummyData)
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [currentRecord, setCurrentRecord] = useState(
    dummyData[0] ? dummyData[0] : null
  )

  const handleRoleChange = (record: any, value: string) => {
    const updatedData = [...data]
    updatedData[record.key].role = value
    setData(updatedData)
    filterData(selectedStatus, searchText)
  }

  const handleHourlyRateChange = (record: any, value: number) => {
    const updatedData = [...data]
    updatedData[record.key].hourlyRate = value
    setData(updatedData)
    filterData(selectedStatus, searchText)
  }

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
          Invite Member
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
      <ChangeRateModal
        key={currentRecord?.key}
        open={changeRateModalOpen}
        setOpen={setChangeRateModalOpen}
        record={currentRecord}
        onOk={(record, newRate) => {
          handleHourlyRateChange(record, newRate)
        }}
      ></ChangeRateModal>
      <Modal
        title="Invite Member"
        open={modalOpen}
        onOk={() => setModalOpen(false)}
        onCancel={() => setModalOpen(false)}
      >
        {/* Add form inputs to capture new client data */}
      </Modal>
    </div>
  )
}
