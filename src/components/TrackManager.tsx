import Search from '@/components/Search'
import cookieKeys from '@/constants/cookie-keys'
import AddBatchTT from '@/pages/time-tracker/components/AddBatchTT'
import AddTT from '@/pages/time-tracker/components/AddTT'
import EditTTDrawer from '@/pages/time-tracker/components/EditTTDrawer'
import TTTableActionColumn from '@/pages/time-tracker/components/TTTableActionColumn'
import TTTableActionHeader from '@/pages/time-tracker/components/TTTableActionHeader'
import useApi from '@/services/useApi'
import useCookie from '@/services/useCookie'
import { formatDate } from '@/util'
import { DatePicker, message, Row, Space, Table, Typography } from 'antd'
import {
  SorterResult,
  FilterValue,
  TablePaginationConfig,
  ColumnsType,
} from 'antd/es/table/interface'
import { plainToClass } from 'class-transformer'
import {
  ClientRelation,
  ProjectRelation,
  Resource,
  TT,
  TTGetAllParams,
  WorkPeriod,
} from 'models'
import { SearchTexts } from 'models/TimeTrack/req-bodies/TTGetAllParams'
import { useCallback, useEffect, useMemo, useState } from 'react'

interface RenderProps<IsMe extends 'time' | 'team'> {
  clients: ClientRelation[]
  projects: ProjectRelation[]
  partnerNames: string[]
  type: IsMe
  resources: IsMe extends 'team' ? Resource[] : undefined
}
type DateFilter = [Date | undefined, Date | undefined]

export default function TrackManager<IsMe extends 'time' | 'team'>({
  resources,
  clients,
  projects,
  partnerNames,
  type,
}: RenderProps<IsMe>) {
  const isMe = type === 'time'
  const [messageApi, contextHolder] = message.useMessage()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useCookie(cookieKeys.COOKIE_PAGE_SIZE, 20)
  const [sorter, setSorter] = useState<SorterResult<TT>>()
  const [filters, setFilters] = useState<Record<string, FilterValue | null>>()
  const [dateFilter, setDateFilter] = useState<DateFilter>([
    undefined,
    undefined,
  ])
  const [searchTexts, setSearchTexts] = useState(new SearchTexts())
  const setSearchText = (key: keyof SearchTexts, value: string) => {
    const newSearchTexts = { ...searchTexts, [key]: value }
    setSearchTexts(newSearchTexts)
    return newSearchTexts
  }
  const [selectedRowIndex, setSelectedRowIndex] = useState<number | null>(null)
  const {
    data: dataTT,
    call: callTT,
    loading: loadingTT,
  } = useApi('timeTrack', 'getAll')
  const { data: workPeriods, call: getAllWorkPeriods } = useApi(
    'workPeriod',
    'getAll',
    []
  )
  const { call: deleteTT } = useApi('timeTrack', 'delete')

  const {
    data: report,
    call: callGetTotalHoursReport,
    loading: reportsLoading,
  } = useApi('report', 'getTrackerHours')

  const selectedRecord =
    selectedRowIndex != null ? dataTT?.data[selectedRowIndex] : undefined

  const ttGetAllParams = useMemo(
    () =>
      TTGetAllParams.createFromParams(
        page,
        pageSize,
        sorter,
        filters,
        isMe,
        dateFilter,
        searchTexts
      ),
    [filters, isMe, page, pageSize, sorter, dateFilter, searchTexts]
  )

  const getTTs = useCallback(
    (
      pageParam = 1,
      pageSizeParam = 20,
      sorterParam: SorterResult<TT> | undefined = undefined,
      filtersParam: any | undefined = undefined,
      dateFilter: DateFilter = [undefined, undefined],
      searchTexts = new SearchTexts()
    ) => {
      const ttGetAllParams = TTGetAllParams.createFromParams(
        pageParam,
        pageSizeParam,
        sorterParam,
        filtersParam,
        isMe,
        dateFilter,
        searchTexts
      )
      callTT(ttGetAllParams)
    },
    [callTT, isMe]
  )

  const onTableChange = useCallback(
    (
      pagination: TablePaginationConfig,
      filters: Record<string, FilterValue | null>,
      sorter: SorterResult<TT> | SorterResult<TT>[]
    ) => {
      // Never array always single cuz no multisort
      sorter = sorter as SorterResult<TT>
      // Refresh table by fetching api with new table params
      getTTs(
        pagination.current,
        pagination.pageSize,
        sorter,
        filters,
        dateFilter,
        searchTexts
      )
      // Updating states
      setPage(pagination.current!)
      setPageSize(pagination.pageSize!)
      setSorter(sorter)
      setFilters(filters)
    },
    [getTTs, setPage, setPageSize, setSorter, setFilters]
  )

  const onDelete = useCallback(
    async (id: string) => {
      try {
        await deleteTT({ id })
        getTTs(page, pageSize, sorter, filters, dateFilter, searchTexts)
        messageApi.success('Deleted timetrack successfully!')
      } catch {
        messageApi.error('An error occurred. Could not delete timetrack.')
      }
    },
    [deleteTT, getTTs, messageApi, page, pageSize, sorter, filters, dateFilter]
  )

  const columns = useMemo<ColumnsType<TT>>(() => {
    return [
      {
        title: 'Date',
        dataIndex: 'date',
        key: 'date',
        render: (value: Date) => <span>{formatDate(value)}</span>,
        sorter: true,
        filterDropdown: ({ confirm }) => (
          <div style={{ padding: 8 }}>
            <DatePicker.RangePicker
              allowClear={true}
              onChange={values => {
                const dates: DateFilter = [undefined, undefined]
                if (values) {
                  //If not cleared
                  dates[0] = values[0]?.toDate()
                  dates[1] = values[1]?.toDate()
                }
                setDateFilter(dates)
                confirm()
                getTTs(1, pageSize, sorter, filters, dates, searchTexts)
              }}
            />
          </div>
        ),
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
        title: 'Partner name',
        dataIndex: 'partnerName',
        key: 'client.partnerName',
        filterSearch: true,
        filters: partnerNames
          .sort((a, b) => a.localeCompare(b))
          .map(e => ({
            text: e,
            value: e,
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
        filterDropdown: ({ confirm }) => (
          <div style={{ padding: 8 }} onKeyDown={e => e.stopPropagation()}>
            <Search
              placeholder={'Search by description'}
              withButton
              onSearch={searchText => {
                const newSearchTexts = setSearchText('description', searchText)
                confirm()
                getTTs(1, pageSize, sorter, filters, dateFilter, newSearchTexts)
              }}
            />
          </div>
        ),
      },
      ...(isMe
        ? []
        : [
            {
              title: 'User',
              dataIndex: 'userAbbr',
              key: 'user.abbr',
              sorter: true,
              filterSearch: true,
              filters: resources!
                .sort((a, b) => a.abbr.localeCompare(b.abbr))
                .map(e => ({
                  text: e.abbr,
                  value: e.id,
                })),
            },
            {
              title: 'Last updated by',
              dataIndex: 'updatedByAbbr',
              key: 'updatedBy.abbr',
              sorter: true,
              filterSearch: true,
              filters: resources!
                .sort((a, b) => a.abbr.localeCompare(b.abbr))
                .map(e => ({
                  text: e.abbr,
                  value: e.id,
                })),
            },
          ]),
      {
        title: 'Billable',
        dataIndex: 'billable',
        key: 'billable',
        sorter: true,
        filters: [
          { text: 'YES', value: true },
          { text: 'NO', value: false },
        ],
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
        title: 'Last updated at',
        dataIndex: 'updatedAt',
        key: 'updatedAt',
        render: (value: Date) => <span>{formatDate(value)}</span>,
        sorter: true,
        filterDropdown: ({ confirm }) => (
          <div style={{ padding: 8 }}>
            <DatePicker.RangePicker
              allowClear={true}
              onChange={values => {
                const dates: DateFilter = [undefined, undefined]
                if (values) {
                  //If not cleared
                  dates[0] = values[0]?.toDate()
                  dates[1] = values[1]?.toDate()
                }
                setDateFilter(dates)
                confirm()
                getTTs(1, pageSize, sorter, filters, dates, searchTexts)
              }}
            />
          </div>
        ),
      },
      {
        title: () => <TTTableActionHeader ttGetAllParams={ttGetAllParams} />,
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
  }, [
    clients,
    isMe,
    resources,
    projects,
    ttGetAllParams,
    workPeriods,
    onDelete,
  ])

  function onUpdate(record: TT) {
    if (selectedRowIndex != null && dataTT?.data) {
      dataTT.data[selectedRowIndex] = record
      dataTT.data = [...dataTT.data]
      messageApi.success('Updated timetrack successfully!')
    } else {
      console.error('this should not happen')
      messageApi.error('Fatal error')
    }
    setDrawerOpen(false)
    setSelectedRowIndex(null)
  }

  useEffect(() => {
    getAllWorkPeriods()
    getTTs(page, pageSize)
  }, [])

  useEffect(() => {
    const {
      dateBefore,
      dateAfter,
      userIds,
      clientIds,
      projectIds,
      partnerNames,
      billableValues,
    } = TTGetAllParams.createFromParams(
      page,
      pageSize,
      sorter,
      filters,
      isMe,
      dateFilter,
      searchTexts
    )

    callGetTotalHoursReport({
      dateAfter,
      dateBefore,
      userIds,
      clientIds,
      projectIds,
      partnerNames,
      billableValues,
      isMe,
      searchTexts,
    })
  }, [filters, isMe, sorter, dateFilter, searchTexts])

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

      {type === 'time' && (
        <AddTT
          onAdd={() => {
            getTTs(1, pageSize, sorter, filters, dateFilter, searchTexts)
            messageApi.success('Added timetrack succesfully!')
          }}
          onError={err => {
            if (typeof err == 'string') messageApi.error(err)
            else messageApi.error('An error occured. Could not add timetrack.')
          }}
          clientOptions={clients}
          projectOptions={projects}
        />
      )}

      <AddBatchTT
        onAdd={() => {
          getTTs(1, pageSize, sorter, filters, dateFilter, searchTexts)
        }}
        clients={clients}
        projects={projects}
        resources={resources}
      />

      <Row justify="end">
        <Space>
          <Typography.Text strong>Total hours:</Typography.Text>
          <Typography.Title level={5} style={{ display: 'contents' }}>
            {report}
          </Typography.Title>
        </Space>
      </Row>

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
        onChange={onTableChange}
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
