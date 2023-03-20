import type { GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import AddTT from '@/pages/tracker/components/AddTT'
import useApi from '@/services/useApi'
import { useEffect, useState } from 'react'
import { formatDate } from '@/util'
import { message, Table } from 'antd'
import { TableQueryParameters } from 'models'
import AddBatchTT from '@/pages/tracker/components/AddBatchTT'

export default function Tracker() {
  const columns = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (value: Date) => <span>{formatDate(value)}</span>,
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
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Billabe',
      dataIndex: 'billable',
      key: 'billable',
      render: (value: boolean) => (value ? 'YES' : 'NO'),
    },
    {
      title: 'Ticket no',
      dataIndex: 'ticketNo',
      key: 'ticketNo',
    },
    {
      title: 'Project',
      dataIndex: 'projectAbbr',
      key: 'projectAbbr',
    },
  ]
  const [messageApi, contextHolder] = message.useMessage()
  const [pageSize, setPageSize] = useState(20)
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

  function getTTs(pageParam = 1, pageSizeParam = 20) {
    callTT(
      TableQueryParameters.create({
        sortBy: [{ column: 'date', direction: 'DESC' }],
        page: pageParam,
        pageSize: pageSizeParam,
      })
    )
  }

  useEffect(() => {
    getAllClients({ entityStatus: 'active' })
    getAllProjects({ entityStatus: 'active' })
    getTTs(1, pageSize)
  }, [])

  function onAdd() {
    getTTs()
    messageApi.success('Timetrack added')
  }

  function onError() {
    messageApi.error('Invalid timetrack')
  }

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
        onAdd={getTTs}
        clientOptions={dataClient}
        projectOptions={dataProject}
      />

      <Table
        size="large"
        scroll={{ x: 'max-content', y: 'calc(100vh - 320px)' }}
        loading={loadingTT}
        rowKey={record => record.id}
        columns={columns}
        dataSource={dataTT?.data}
        pagination={{
          position: ['bottomCenter'],
          responsive: true,
          showQuickJumper: false,
          pageSize,
          showLessItems: true,
          showTotal: total => `Total ${total} time tracks`,
          showSizeChanger: true,
          total: dataTT?.count,
          onChange: (page, pageSize) => {
            getTTs(page, pageSize)
            setPageSize(pageSize)
          },
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
