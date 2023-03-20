import type { GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useEffect, useMemo, useState } from 'react'
import { Button, message, Table, Tag } from 'antd'
import EditClientDrawer from '@/pages/clients/components/EditClientDrawer'
import { DEFAULT_ACTION_COLUMN_WIDTH } from '@/constants'
import { Client, ClientUpdateBody } from 'models'
import { FaExpandAlt } from 'react-icons/fa'
import AddClientDrawer from '@/pages/clients/components/AddClientDrawer'
import useApi from '@/services/useApi'
import { type ColumnsType } from 'antd/es/table'
import TableActionColumn from '@/components/TableActionColumn'
import Filter from '@/components/Filter'
import DateCell from '@/components/DateCell'

type DrawerStatus = 'create' | 'edit' | 'none'

export default function Clients() {
  const columns: ColumnsType<Client> = [
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
      sorter: (a, b) => a.abbr.localeCompare(b.abbr),
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
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Partner name',
      dataIndex: 'partnerName',
      key: 'partnerName',
      sorter: (a, b) =>
        a.partnerName
          ? a.partnerName.localeCompare(b.partnerName ?? '')
          : ''.localeCompare(b.partnerName ?? ''),
    },
    {
      title: 'Start date',
      dataIndex: 'startDate',
      key: 'startDate',
      render: (value: Date) => <DateCell value={value} />,
      sorter: (a, b) =>
        new Date(a.startDate).valueOf() - new Date(b.startDate).valueOf(),
      showSorterTooltip: true,
    },

    {
      title: 'Contract type',
      dataIndex: 'contractType',
      key: 'contractType',
      sorter: (a, b) => a.contractType.localeCompare(b.contractType),
    },
    {
      title: 'Contract date',
      dataIndex: 'contractDate',
      key: 'contractDate',
      render: (value: Date) => <DateCell value={value} />,
      sorter: (a, b) =>
        (a.contractDate ? new Date(a.contractDate).valueOf() : 0) -
        (b.contractDate ? new Date(b.contractDate).valueOf() : 0),
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
          style={{ paddingTop: 0, paddingBottom: 0 }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Tag color={record.everyoneHasAccess ? 'warning' : 'processing'}>
              {record.everyoneHasAccess ? 'Everyone' : 'Custom'}
            </Tag>
            <FaExpandAlt size={16} style={{ color: 'blue', marginLeft: 4 }} />
          </div>
        </Button>
      ),
      sorter: (a, b) =>
        Number(a.everyoneHasAccess) - Number(b.everyoneHasAccess),
    },
    {
      title: '',
      key: 'action',
      width: DEFAULT_ACTION_COLUMN_WIDTH,
      fixed: 'right',
      render: (record: Client) => (
        <TableActionColumn
          isActive={record.active}
          onEdit={() => {
            openEditDrawer(record, '1')
          }}
          onArchive={() => setClientStatus(false, record)}
          onRestore={() => setClientStatus(true, record)}
        />
      ),
    },
  ]

  const {
    data,
    call,
    loading: loadingGetAll,
    setData,
  } = useApi('client', 'getAll', [])
  const { call: update, loading: loadingUpdate } = useApi('client', 'update')
  const [messageApi, contextHolder] = message.useMessage()
  const [drawerStatus, setDrawerStatus] = useState<DrawerStatus>('none')
  const [drawerTabKey, setDrawerTabKey] = useState('1')
  const [searchText, setSearchText] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('active')
  const [currentRecord, setCurrentRecord] = useState<Client | null>(null)
  const [selectedRowKey, setSelectedRowKey] = useState<string | null>(null)

  const loading = loadingUpdate || loadingGetAll

  const filteredData = useMemo(() => {
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
    return filtered
  }, [data, searchText, selectedStatus])

  const find = (record: Client): number => {
    return data.findIndex(x => x.id === record.id)
  }

  function onAdd(value: Client) {
    if (!data.length) setData([value])
    else setData(prev => [value, ...prev])
    messageApi.success('Client added successfully!')
  }

  function onUpdate(record: Client) {
    const index = find(record)
    if (index != -1) {
      data[index] = record
      setData(prev => [...prev])
    }
    setCurrentRecord(record)
    messageApi.success('Client updated successfully!')
  }

  async function setClientStatus(isActive: boolean, record: Client) {
    try {
      await update(ClientUpdateBody.createPartially({ active: isActive }), {
        id: record.id,
      })
      record.active = isActive
      setData(prev => [...prev])
      messageApi.success(
        isActive
          ? 'Client restored successfully!'
          : 'Client archived successfully!'
      )
    } catch {
      messageApi.error(
        isActive
          ? 'An error occured. Could not restore client.'
          : 'An error occured. Could not archive client.'
      )
    }
  }

  const openEditDrawer = (record: Client, tabKey: string) => {
    setDrawerTabKey(tabKey)
    setCurrentRecord(record)
    setSelectedRowKey(record.id)
    setDrawerStatus('edit')
  }

  useEffect(() => {
    call({ entityStatus: 'all' })
  }, [])

  return (
    <>
      {contextHolder}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 20,
        }}
      >
        <Filter
          onStatusChange={setSelectedStatus}
          onSearch={setSearchText}
          searchText={searchText}
          searchPlaceholder="Search by name"
        />
        <Button
          type="primary"
          onClick={() => {
            setDrawerStatus('create')
          }}
        >
          Add Client
        </Button>
      </div>
      <Table
        size="large"
        scroll={{ x: 'max-content', y: 'calc(100vh - 320px)' }}
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
          showSizeChanger: true,
        }}
      />
      {currentRecord && (
        <EditClientDrawer
          activeTabKey={drawerTabKey}
          onActiveTabKeyChange={setDrawerTabKey}
          open={drawerStatus === 'edit'}
          value={currentRecord}
          onCancel={() => {
            setDrawerStatus('none')
            setSelectedRowKey(null)
          }}
          onUpdate={onUpdate}
          onError={() =>
            messageApi.error('An error occured. Could not update client')
          }
        />
      )}
      <AddClientDrawer
        open={drawerStatus === 'create'}
        onCancel={() => {
          setDrawerStatus('none')
        }}
        onAdd={onAdd}
        onError={() =>
          messageApi.error('An error occured. Could not add client')
        }
      />
    </>
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
