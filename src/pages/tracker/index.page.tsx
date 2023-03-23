import type { GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import AddTT from '@/pages/tracker/components/AddTT'
import useApi from '@/services/useApi'
import { useEffect, useState } from 'react'
import { formatDate } from '@/util'
import { message, Table } from 'antd'
import { TableQueryParameters, TT, WorkPeriod } from 'models'
import AddBatchTT from '@/pages/tracker/components/AddBatchTT'
import type { ColumnsType, SorterResult } from 'antd/es/table/interface'
import { DEFAULT_ACTION_COLUMN_WIDTH } from '@/constants'
import { plainToClass } from 'class-transformer'
import TTTableActionColumn from '@/pages/tracker/components/TTTableActionColumn'
import EditTTDrawer from '@/pages/tracker/components/EditTTDrawer'

export default function Tracker() {
  const columns: ColumnsType<TT> = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (value: Date) => <span>{formatDate(value)}</span>,
      sorter: true,
    },
    {
      title: 'Client',
      dataIndex: 'clientAbbr',
      key: 'clientAbbr',
    },
    {
      title: 'Hour',
      dataIndex: 'hour',
      key: 'hour',
      sorter: true,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      sorter: true,
    },
    {
      title: 'Billabe',
      dataIndex: 'billable',
      key: 'billable',
      sorter: true,
      render: (value: boolean) => (value ? 'YES' : 'NO'),
    },
    {
      title: 'Ticket no',
      dataIndex: 'ticketNo',
      key: 'ticketNo',
      sorter: true,
    },
    {
      title: 'Project',
      dataIndex: 'projectAbbr',
      key: 'projectAbbr',
    },
    {
      title: '',
      key: 'action',
      fixed: 'right',
      width: DEFAULT_ACTION_COLUMN_WIDTH,
      render: (record: TT) =>
        workPeriods.some(
          e =>
            plainToClass(WorkPeriod, e).periodString ===
            WorkPeriod.fromDate(new Date(record.date)).periodString
        ) ? (
          <TTTableActionColumn
            onEdit={() => null}
            onDelete={() => onDelete(record.id)}
          />
        ) : null,
    },
  ]

  const [messageApi, contextHolder] = message.useMessage()
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [sorter, setSorter] = useState<SorterResult<TT>>()
  const {
    data: dataTT,
    call: callTT,
    loading: loadingTT,
  } = useApi('timeTrack', 'getAll')
  const { data: dataClient, call: getAllClients } = useApi(
    'client',
    'getAll',
    []
  )
  const { data: dataProject, call: getAllProjects } = useApi(
    'project',
    'getAll',
    []
  )
  const { data: workPeriods, call: getAllWorkPeriods } = useApi(
    'workPeriod',
    'getAll',
    []
  )
  const { call: deleteTT } = useApi('timeTrack', 'delete')

  function getTTs(
    pageParam = 1,
    pageSizeParam = 20,
    sorter: SorterResult<TT> | undefined = undefined
  ) {
    let sortBy: { column: string; direction: 'ASC' | 'DESC' }
    if (sorter?.column) {
      sortBy = {
        column: sorter.field! as string,
        direction: sorter.order == 'ascend' ? 'ASC' : 'DESC',
      }
    } else {
      sortBy = { column: 'date', direction: 'DESC' }
    }
    setSorter(sorter)
    setPage(pageParam)
    setPageSize(pageSizeParam)
    callTT(
      TableQueryParameters.create({
        sortBy: [sortBy],
        page: pageParam,
        pageSize: pageSizeParam,
      })
    )
  }
  function onAdd() {
    getTTs(1, pageSize, sorter)
    messageApi.success('Timetrack added')
  }

  function onError() {
    messageApi.error('Invalid timetrack')
  }
  async function onDelete(id: string) {
    try {
      await deleteTT({ id })
      getTTs(page, pageSize, sorter)
      messageApi.success('Deleted timetrack successfully!')
    } catch {
      messageApi.error('An error occured. Could not delete timetrack.')
    }
  }

  useEffect(() => {
    getAllClients({ entityStatus: 'active' })
    getAllProjects({ entityStatus: 'active' })
    getAllWorkPeriods()
    getTTs(1, pageSize)
  }, [])

  return (
    <>
      {contextHolder}
      <AddTT
        onError={onError}
        onAdd={onAdd}
        clientOptions={dataClient}
        projectOptions={dataProject}
      />
      <AddBatchTT
        onAdd={() => {
          getTTs(1, pageSize, sorter)
        }}
        clientOptions={dataClient}
        projectOptions={dataProject}
      />

      <Table
        size="large"
        scroll={{ x: 'max-content' }}
        loading={loadingTT}
        rowKey={record => record.id}
        columns={columns}
        dataSource={dataTT?.data}
        onChange={(e, _b, s) =>
          getTTs(e.current, e.pageSize, s as SorterResult<TT>)
        }
        pagination={{
          position: ['bottomCenter'],
          showQuickJumper: false,
          pageSize,
          current: page,
          showLessItems: true,
          showTotal: total => `Total ${total} time tracks`,
          showSizeChanger: true,
          total: dataTT?.count,
        }}
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
