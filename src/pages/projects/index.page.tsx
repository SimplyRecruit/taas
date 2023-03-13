import type { GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useEffect, useMemo, useState } from 'react'
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
  const [modalOpen, setModalOpen] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('active')
  const [currentRecord, setCurrentRecord] = useState<Project | null>(null)

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

  const find = (record: Project): number => {
    return data.findIndex(x => x.id === record.id)
  }

  function onUpdate(record: Project) {
    const index = find(record)
    if (index != -1) {
      data[index] = record
      setData(prev => [...prev])
    }
    setCurrentRecord(record)
  }

  async function setProjectStatus(isActive: boolean, record: Project) {
    try {
      await update(ProjectUpdateBody.createPartially({ active: isActive }), {
        id: record.id,
      })
      record.active = isActive
      setData(prev => [...prev])
    } catch (error) {
      console.log(error)
    }
  }

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
