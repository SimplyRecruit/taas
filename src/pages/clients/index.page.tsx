import { useEffect, useState } from 'react'
import { Button, Table, Tag } from 'antd'
import { FiEdit } from 'react-icons/fi'
import ClientsFilter from '@/pages/clients/components/ClientsFilter'
import EditClientDrawer from '@/pages/clients/components/EditClientDrawer'
import { DEFAULT_ACTION_COLUMN_WIDTH } from '@/constants'
import { Client, ClientContractType } from 'models'
import { dateToMoment } from '@/util'
import { FaExpandAlt } from 'react-icons/fa'
import AddClientDrawer from '@/pages/clients/components/AddClientDrawer'

type ModalStatus = 'create' | 'edit' | 'none'

export default function Clients() {
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      render: (text: string, record: Client) => (
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
      render: (text: string, record: Client) => (
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
      title: 'Partner name',
      dataIndex: 'partnerName',
      key: 'partnerName',
    },
    {
      title: 'Start date',
      dataIndex: 'startDate',
      key: 'startDate',
      render: (value: Date) => <span>{dateToMoment(value)}</span>,
    },

    {
      title: 'Contract type',
      dataIndex: 'contractType',
      key: 'contractType',
    },
    {
      title: 'Contract date',
      dataIndex: 'contractDate',
      key: 'contractDate',
      render: (value: Date) => <span>{dateToMoment(value)}</span>,
    },
    {
      title: 'Access',
      dataIndex: 'access',
      key: 'access',
      render: () => (
        <Button
          onClick={() => {
            setModalStatus('edit')
          }}
          type="text"
          size="small"
        >
          <div style={{ display: 'flex' }}>
            <Tag color="processing">Restricted</Tag>
            <FaExpandAlt
              size={16}
              style={{ color: 'blue', marginTop: 3, marginLeft: 4 }}
            />
          </div>
        </Button>
      ),
    },
    {
      title: '',
      key: 'action',
      width: DEFAULT_ACTION_COLUMN_WIDTH,
      render: (record: Client) => (
        <span>
          <FiEdit
            onClick={() => {
              setCurrentRecord(record)
              setSelectedRowKey(record.id)
              setModalStatus('edit')
            }}
            style={{ cursor: 'pointer' }}
          />
        </span>
      ),
    },
  ]

  const data: Client[] = [
    {
      id: '1',
      name: 'deneme proj',
      active: true,
      startDate: new Date(),
      contractType: ClientContractType.MAINTENANCE,
      contractDate: new Date(),
      partnerName: 'bilemedim',
      everyoneHasAccess: true,
    },
    {
      id: '2',
      name: 'test proj',
      active: true,
      contractType: ClientContractType.ON_DEMAND,
      startDate: new Date(),
      contractDate: new Date(),
      partnerName: 'bilemedim',
      everyoneHasAccess: true,
    },
  ]
  const [modalStatus, setModalStatus] = useState<ModalStatus>('none')
  const [searchText, setSearchText] = useState('')
  const [filteredData, setFilteredData] = useState(data)
  const [selectedStatus, setSelectedStatus] = useState('active')
  const [currentRecord, setCurrentRecord] = useState<Client | null>(null)
  const [selectedRowKey, setSelectedRowKey] = useState<string | null>(null)

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
        <ClientsFilter
          onStatusChange={handleStatusChange}
          onSearch={handleSearch}
          searchText={searchText}
        />
        <Button
          type="primary"
          onClick={() => {
            setCurrentRecord(null)
            setModalStatus('create')
          }}
        >
          Add Client
        </Button>
      </div>
      <Table
        size="large"
        rowClassName={record => {
          if (selectedRowKey == record.id) {
            return 'ant-table-row-selected'
          }
          return ''
        }}
        rowKey={record => record.id}
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
      <EditClientDrawer
        key={currentRecord?.id}
        open={modalStatus === 'edit'}
        value={currentRecord}
        onCancel={() => {
          setModalStatus('none')
          setSelectedRowKey(null)
        }}
        onUpdate={value => console.log(value)}
      />
      <AddClientDrawer
        open={modalStatus === 'create'}
        onCancel={() => {
          setModalStatus('none')
          setSelectedRowKey(null)
        }}
        onAdd={value => console.log(value)}
      />
    </div>
  )
}
