import type { GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useEffect, useMemo, useState } from 'react'
import { Button, message, Table, Tag } from 'antd'
import EditProjectModal from '@/pages/projects/components/EditProjectDrawer'
import { Client, Project, ProjectUpdateBody } from 'models'
import Filter from '@/components/Filter'
import { DEFAULT_ACTION_COLUMN_WIDTH } from '@/constants'
import useApi from '@/services/useApi'
import { ALL_UUID } from '~/common/Config'
import { type ColumnsType } from 'antd/es/table'
import TableActionColumn from '@/components/TableActionColumn'
import DateCell from '@/components/DateCell'

export default function ProjectsPage() {
  const columns: ColumnsType<Project> = [
    {
      title: 'Abbreviation',
      dataIndex: 'abbr',
      key: 'abbr',
      render: (text: string, record: Project) => (
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
      render: (text: string, record: Project) => (
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
      title: 'Client',
      dataIndex: 'client',
      key: 'client',
      render: (client: Client) => {
        return (
          <Tag>
            {client.id == ALL_UUID ? 'ALL' : `${client.abbr} - ${client.name}`}
          </Tag>
        )
      },
      sorter: (a, b) => a.client.abbr.localeCompare(b.client.abbr),
    },
    {
      title: 'Start Date',
      dataIndex: 'startDate',
      key: 'startDate',
      render: (value: Date) => <DateCell value={value} />,
      sorter: (a, b) =>
        new Date(a.startDate).valueOf() - new Date(b.startDate).valueOf(),
    },
    {
      title: '',
      key: 'action',
      width: DEFAULT_ACTION_COLUMN_WIDTH,
      render: (_text: any, record: Project, index: number) => (
        <TableActionColumn
          isActive={record.active}
          onEdit={() => {
            setSelectedRowIndex(index)
            setModalOpen(true)
          }}
          onArchive={() => setProjectStatus(false, record)}
          onRestore={() => setProjectStatus(true, record)}
        />
      ),
    },
  ]

  const {
    data,
    call,
    setData,
    loading: loadingGetAll,
  } = useApi('project', 'getAll', [])
  const { call: update, loading: loadingUpdate } = useApi('project', 'update')
  const [messageApi, contextHolder] = message.useMessage()
  const [modalOpen, setModalOpen] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('active')
  const [selectedRowIndex, setSelectedRowIndex] = useState<number | null>(null)

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

  const selectedRecord =
    typeof selectedRowIndex == 'number'
      ? filteredData[selectedRowIndex]
      : undefined

  function onUpdate(record: Project) {
    if (typeof selectedRowIndex == 'number') {
      data[selectedRowIndex] = record
      console.log(record)
      setData(prev => [...prev])
      messageApi.success('Project updated successfully!')
    } else {
      console.log('this should not happen')
      messageApi.error('Fatal error')
    }
    setModalOpen(false)
    setSelectedRowIndex(null)
  }

  async function setProjectStatus(isActive: boolean, record: Project) {
    try {
      await update(ProjectUpdateBody.createPartially({ active: isActive }), {
        id: record.id,
      })
      record.active = isActive
      setData(prev => [...prev])
      messageApi.success(
        isActive
          ? 'Project restored successfully!'
          : 'Project archived successfully!'
      )
    } catch {
      messageApi.error(
        isActive
          ? 'An error occured. Could not restore project.'
          : 'An error occured. Could not archive project.'
      )
    }
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
          onSearch={setSearchText}
          onStatusChange={setSelectedStatus}
          searchText={searchText}
          searchPlaceholder="Search by name"
        />
        <Button
          type="primary"
          onClick={() => {
            setSelectedRowIndex(null)
            setModalOpen(true)
          }}
        >
          Add Project
        </Button>
      </div>
      <Table
        rowKey="id"
        columns={columns}
        loading={loading}
        rowClassName={record => {
          if (selectedRecord?.id == record.id) {
            return 'ant-table-row-selected'
          }
          return ''
        }}
        dataSource={filteredData}
        pagination={{
          position: ['bottomCenter'],
          responsive: true,
          showQuickJumper: false,
          showLessItems: true,
          showTotal: total => `Total ${total} projects`,
          showSizeChanger: true,
        }}
      />
      <EditProjectModal
        open={modalOpen}
        value={selectedRecord}
        onCancel={() => {
          setModalOpen(false)
          setSelectedRowIndex(null)
        }}
        onAdd={e => {
          setData([e, ...(data ?? [])])
          setModalOpen(false)
          messageApi.success('Project added successfully!')
        }}
        onUpdate={onUpdate}
        onError={() =>
          messageApi.error(
            selectedRecord
              ? 'An error occured. Could not update project.'
              : 'An error occured. Could not add project.'
          )
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
