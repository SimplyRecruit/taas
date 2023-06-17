import type { GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import useApi from '@/services/useApi'
import { useCallback, useEffect, useState, useMemo } from 'react'
import { formatDate } from '@/util'
import { message, Table } from 'antd'
import { TT, TTGetAllParams, WorkPeriod } from 'models'
import AddBatchTT from '@/pages/time-tracker/components/AddBatchTT'
import type { ColumnsType, SorterResult } from 'antd/es/table/interface'
import { plainToClass } from 'class-transformer'
import TTTableActionColumn from '@/pages/time-tracker/components/TTTableActionColumn'
import EditTTDrawer from '@/pages/time-tracker/components/EditTTDrawer'
import TTFilterType from '@/pages/time-tracker/types/TTFilterType'
import cookieKeys from '@/constants/cookie-keys'
import useCookie from '@/services/useCookie'

export default function TeamTracker() {
  const [messageApi, contextHolder] = message.useMessage()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useCookie(cookieKeys.COOKIE_PAGE_SIZE, 20)
  const [sorter, setSorter] = useState<SorterResult<TT>>()
  const [selectedRowIndex, setSelectedRowIndex] = useState<number | null>(null)
  const {
    data: dataTT,
    call: callTT,
    loading: loadingTT,
  } = useApi('timeTrack', 'getAll')
  const { data: resources, call: getAllResources } = useApi(
    'resource',
    'getAll',
    []
  )
  const { data: clients, call: getAllClients } = useApi('client', 'getAll', [])
  const { data: projects, call: getAllProjects } = useApi(
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
  const selectedRecord =
    selectedRowIndex != null ? dataTT?.data[selectedRowIndex] : undefined
  const getTTs = useCallback(
    (
      pageParam = 1,
      pageSizeParam = 20,
      sorter: SorterResult<TT> | undefined = undefined,
      filters: any | undefined = undefined
    ) => {
      let sortBy: { column: string; direction: 'ASC' | 'DESC' }
      if (sorter?.columnKey) {
        sortBy = {
          column: sorter.columnKey as string,
          direction: sorter.order === 'ascend' ? 'ASC' : 'DESC',
        }
      } else {
        sortBy = { column: 'date', direction: 'DESC' }
      }
      setSorter(sorter)
      setPage(pageParam)
      setPageSize(pageSizeParam)
      callTT(
        TTGetAllParams.create({
          sortBy: [sortBy],
          page: pageParam,
          pageSize: pageSizeParam,
          userIds: filters?.[`${TTFilterType.USER}`],
          clientIds: filters?.[`${TTFilterType.CLIENT}`],
          projectIds: filters?.[`${TTFilterType.PROJECT}`],
          isMe: false,
        })
      )
    },
    [callTT, setSorter, setPage, setPageSize]
  )
  const onDelete = useCallback(
    async (id: string) => {
      try {
        await deleteTT({ id })
        getTTs(page, pageSize, sorter)
        messageApi.success('Deleted timetrack successfully!')
      } catch {
        messageApi.error('An error occurred. Could not delete timetrack.')
      }
    },
    [deleteTT, getTTs, messageApi, page, pageSize, sorter]
  )
  const columns: ColumnsType<TT> = useMemo(() => {
    return [
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
        key: 'client.abbr',
        sorter: true,
        filterSearch: true,
        filters: clients
          .sort((a, b) => a.abbr.localeCompare(b.abbr))
          .map(e => ({
            text: e.abbr,
            value: e.id,
          })),
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
        title: 'User',
        dataIndex: 'userAbbr',
        key: 'user.abbr',
        sorter: true,
        filterSearch: true,
        filters: resources
          .sort((a, b) => a.abbr.localeCompare(b.abbr))
          .map(e => ({
            text: e.abbr,
            value: e.id,
          })),
      },
      {
        title: 'Billable',
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
        key: 'project.abbr',
        sorter: true,
        filterSearch: true,
        filters: projects
          .sort((a, b) => a.abbr.localeCompare(b.abbr))
          .map(e => ({
            text: e.abbr,
            value: e.id,
          })),
      },
      {
        title: '',
        key: 'action',
        render: (_text: any, record: TT, index: number) =>
          workPeriods.some(
            e =>
              plainToClass(WorkPeriod, e).periodString ===
              WorkPeriod.fromDate(new Date(record.date)).periodString
          ) ? (
            <TTTableActionColumn
              onEdit={() => {
                setSelectedRowIndex(index)
                setDrawerOpen(true)
              }}
              onDelete={() => onDelete(record.id)}
            />
          ) : null,
      },
    ]
  }, [resources, clients, projects, workPeriods, onDelete])
  function onUpdate(record: TT) {
    if (selectedRowIndex != null && dataTT?.data) {
      dataTT.data[selectedRowIndex] = record
      dataTT.data = [...dataTT.data]
      messageApi.success('Updated timetrack successfully!')
    } else {
      console.log('this should not happen')
      messageApi.error('Fatal error')
    }
    setDrawerOpen(false)
    setSelectedRowIndex(null)
  }

  useEffect(() => {
    getAllClients({ entityStatus: 'active' })
    getAllProjects({ entityStatus: 'active' })
    getAllResources({ entityStatus: 'active' })
    getAllWorkPeriods()
    getTTs(1, pageSize)
  }, [])

  return (
    <>
      {contextHolder}
      <EditTTDrawer
        open={drawerOpen}
        value={selectedRecord}
        clientOptions={clients}
        projectOptions={projects}
        onUpdate={onUpdate}
        onError={() => {
          messageApi.error('An error occured. Could not update timetrack.')
        }}
        onCancel={() => setDrawerOpen(false)}
      />

      <AddBatchTT
        onAdd={() => {
          getTTs(1, pageSize, sorter)
        }}
        clients={clients}
        projects={projects}
        resources={resources}
      />

      <Table
        size="middle"
        loading={loadingTT}
        rowKey={record => record.id}
        rowClassName={record => {
          if (selectedRecord?.id == record.id && drawerOpen) {
            return 'ant-table-row-selected'
          }
          return ''
        }}
        columns={columns}
        dataSource={dataTT?.data}
        onChange={(e, filters, sorter) =>
          getTTs(e.current, e.pageSize, sorter as SorterResult<TT>, filters)
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
