import type { GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useEffect, useState } from 'react'
import { Button, Table, Tag } from 'antd'
import EditProjectModal from '@/pages/projects/components/EditProjectModal'
import { Client, Project, ProjectUpdateBody } from 'models'
import Filter from '@/components/Filter'
import { DEFAULT_ACTION_COLUMN_WIDTH } from '@/constants'
import useApi from '@/services/useApi'
import { formatDate } from '@/util'
import { ALL_UUID } from '~/common/Config'
import TableActionColumn from '@/components/TableActionColumn'

export default function ProjectsPage() {
  const columns = [
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
    },
    {
      title: 'Start Date',
      dataIndex: 'startDate',
      key: 'startDate',
      render: (date: Date) => {
        return <div>{formatDate(date)}</div>
      },
    },
    {
      title: '',
      key: 'action',
      width: DEFAULT_ACTION_COLUMN_WIDTH,
      render: (record: Project) => (
        <TableActionColumn
          isActive={record.active}
          onEdit={() => {
            setCurrentRecord(record)
            setModalOpen(true)
          }}
          onArchive={() => setProjectStatus(false, record)}
          onRestore={() => setProjectStatus(true, record)}
          onDelete={() => {
            return null
          }}
        />
      ),
    },
  ]

  const { data, call, setData, loading } = useApi('project', 'getAll')
  const { call: update, loading: loadingUpdate } = useApi('project', 'update')
  const [modalOpen, setModalOpen] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [filteredData, setFilteredData] = useState<Project[]>([])
  const [selectedStatus, setSelectedStatus] = useState('active')
  const [currentRecord, setCurrentRecord] = useState<Project | null>(null)

  const filterData = (data: Project[]) => {
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
    setFilteredData(filtered)
  }

  const find = (record: Project, values: Project[]): number => {
    return values.findIndex(x => x.id === record.id)
  }

  function onUpdate(record: Project) {
    if (!data) return
    const index = find(record, data)
    if (index != -1) {
      data[index] = record
      setData([...data])
    }
    setCurrentRecord(record)
  }
  async function setProjectStatus(isActive: boolean, record: Project) {
    try {
      await update(ProjectUpdateBody.createPartially({ active: isActive }), {
        id: record.id,
      })
      record.active = isActive
      setData([...data!])
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (!data) return
    filterData(data)
  }, [data, searchText, selectedStatus])

  useEffect(() => {
    call()
  }, [])

  return (
    <>
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
        loading={loading}
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
        open={modalOpen}
        value={currentRecord}
        onCancel={() => setModalOpen(false)}
        onAdd={e => {
          setData([e, ...(data ?? [])])
          setModalOpen(false)
        }}
        onUpdate={onUpdate}
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
