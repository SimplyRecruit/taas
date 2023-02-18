import type { GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { Button, Input, Modal, Select, Space, Table } from 'antd'
import { useEffect, useState } from 'react'
import { FiEdit2 } from 'react-icons/fi'
import ClientsFilter from '@/pages/clients/components/ClientsFilter'
import EditClientDrawer from '@/pages/clients/components/EditClientDrawer'
import { DEFAULT_ACTION_COLUMN_WIDTH } from '@/constants'
import { Client, ClientContractType } from 'models'
import { dateToMoment } from '@/util'

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
      render: () => <span>Public</span>,
    },
    {
      title: '',
      key: 'action',
      width: DEFAULT_ACTION_COLUMN_WIDTH,
      render: () => (
        <span>
          <FiEdit2
            onClick={() => {
              setModalOpen(true)
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
    },
    {
      id: '2',
      name: 'test proj',
      active: true,
      contractType: ClientContractType.ON_DEMAND,
      startDate: new Date(),
      contractDate: new Date(),
      partnerName: 'bilemedim',
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
        <Button type="primary" onClick={() => setModalOpen(true)}>
          Add Client
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
      <EditClientDrawer
        open={modalOpen}
        value={null}
        onCancel={() => setModalOpen(false)}
        onAdd={value => console.log(value)}
        onUpdate={value => console.log(value)}
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
