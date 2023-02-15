import { useEffect, useState } from 'react'
import { Button, Input, Modal, Select, Space, Table } from 'antd'
import { FiEdit2 } from 'react-icons/fi'
import { SearchOutlined } from '@ant-design/icons'
import ChangeRateModal from '@/pages/team/components/ChangeRateModal'
import InviteMemberModal from '@/pages/team/components/InviteMemberModal'
import UserRoleSelector from '@/pages/team/components/UserRoleSelector'
import { Resource, UserRole } from 'models'
import useApi from '@/services/useApi'

export default function Team() {
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
        <UserRoleSelector
          value={role as UserRole}
          onChange={value => handleRoleChange(record, value)}
        />
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

  const { data: resources, loading, error, call } = useApi('resource', 'getAll')

  useEffect(() => {
    call()
  }, [])

  useEffect(() => {
    setData(resources)
    filterData(selectedStatus, searchText)
  }, [resources])

  const [inviteMemberModalOpen, setInviteMemberModalOpen] = useState(false)
  const [changeRateModalOpen, setChangeRateModalOpen] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [filteredData, setFilteredData] = useState<Resource[]>([])
  const [data, setData] = useState<Resource[]>([])
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [currentRecord, setCurrentRecord] = useState<Resource | null>(null)

  const find = (record: Resource): number => {
    return data.findIndex(x => x.id === record.id)
  }

  const handleRoleChange = (record: Resource, value: string) => {
    const index = find(record)
    if (index != -1) {
      data[index].role = value as UserRole
      setData([...data])
      filterData(selectedStatus, searchText)
    }
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

  const onUpdate = (record: Resource) => {
    const index = find(record)
    if (index != 1) {
      data[index] = record
      setData([...data])
      filterData(selectedStatus, searchText)
    }
    setCurrentRecord(null)
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
        <Button type="primary" onClick={() => setInviteMemberModalOpen(true)}>
          Invite Member
        </Button>
      </div>
      <Table
        rowKey="id"
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
      <ChangeRateModal
        key={currentRecord?.id}
        open={changeRateModalOpen}
        setOpen={setChangeRateModalOpen}
        record={currentRecord}
        onOk={(record, newRate) => {
          handleHourlyRateChange(record, newRate)
        }}
      />
      <InviteMemberModal
        open={inviteMemberModalOpen}
        onCancel={() => setInviteMemberModalOpen(false)}
        onUpdate={onUpdate}
        onAdd={newMember => {
          setData([newMember, ...data])
          setFilteredData([newMember, ...filteredData])
          setInviteMemberModalOpen(false)
        }}
      />
    </div>
  )
}
