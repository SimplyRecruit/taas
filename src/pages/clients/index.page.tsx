import type { GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useEffect, useState } from 'react'
import { Button, Table, Tag } from 'antd'
import { FiEdit } from 'react-icons/fi'
import ClientsFilter from '@/pages/clients/components/ClientsFilter'
import EditClientDrawer from '@/pages/clients/components/EditClientDrawer'
import { DEFAULT_ACTION_COLUMN_WIDTH } from '@/constants'
import { Client, ClientContractType } from 'models'
import { formatDate } from '@/util'
import { FaExpandAlt } from 'react-icons/fa'
import AddClientDrawer from '@/pages/clients/components/AddClientDrawer'
import useApi from '@/services/useApi'

type DrawerStatus = 'create' | 'edit' | 'none'

export default function Clients() {
  const columns = [
    {
      title: 'Abbreviation',
      dataIndex: 'abbr',
      key: 'abbr',
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
      render: (value: Date) => <span>{formatDate(value)}</span>,
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
      render: (value: Date) => <span>{formatDate(value)}</span>,
    },
    {
      title: 'Access',
      key: 'access',
      render: (record: Client) => (
        <Button
          onClick={() => {
            openEditDrawer(record, '2')
          }}
          type="text"
          size="small"
        >
          <div style={{ display: 'flex' }}>
            <Tag color="processing">
              {record.everyoneHasAccess ? 'Public' : 'Restricted'}
            </Tag>
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
              openEditDrawer(record, '1')
            }}
            style={{ cursor: 'pointer' }}
          />
        </span>
      ),
    },
  ]

  const { data, call, loading, setData } = useApi('client', 'getAll')
  const [drawerStatus, setDrawerStatus] = useState<DrawerStatus>('none')
  const [drawerTabKey, setDrawerTabKey] = useState('1')
  const [searchText, setSearchText] = useState('')
  const [filteredData, setFilteredData] = useState<Client[]>([])
  const [selectedStatus, setSelectedStatus] = useState('active')
  const [currentRecord, setCurrentRecord] = useState<Client | null>(null)
  const [selectedRowKey, setSelectedRowKey] = useState<string | null>(null)

  const find = (record: Client, values: Client[]): number => {
    return values.findIndex(x => x.id === record.id)
  }

  function onAdd(value: Client) {
    console.log(value)
    if (!data) setData([value])
    else setData([value, ...data])
  }

  function onUpdate(record: Client) {
    if (!data) return
    const index = find(record, data)
    if (index != -1) {
      data[index] = record
      setData([...data])
      filterData(data)
    }
    setCurrentRecord(record)
  }

  const openEditDrawer = (record: Client, tabKey: string) => {
    console.log(record)
    setDrawerTabKey(tabKey)
    setCurrentRecord(record)
    setSelectedRowKey(record.id)
    setDrawerStatus('edit')
  }

  useEffect(() => {
    call()
  }, [])

  useEffect(() => {
    if (!data) return
    filterData(data)
  }, [data, searchText, selectedStatus])

  const filterData = (values: Client[]) => {
    let filtered = values
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
          onStatusChange={setSelectedStatus}
          onSearch={setSearchText}
          searchText={searchText}
        />
        <Button
          type="primary"
          onClick={() => {
            setCurrentRecord(null)
            setDrawerStatus('create')
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
        loading={loading}
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
      {currentRecord && (
        <EditClientDrawer
          key={currentRecord?.id}
          activeTabKey={drawerTabKey}
          onActiveTabKeyChange={setDrawerTabKey}
          open={drawerStatus === 'edit'}
          value={currentRecord}
          onCancel={() => {
            setDrawerStatus('none')
            setSelectedRowKey(null)
          }}
          onUpdate={onUpdate}
        />
      )}
      <AddClientDrawer
        open={drawerStatus === 'create'}
        onCancel={() => {
          setDrawerStatus('none')
          setSelectedRowKey(null)
        }}
        onAdd={onAdd}
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
