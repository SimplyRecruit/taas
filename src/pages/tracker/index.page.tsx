import type { GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import AddTT from '@/pages/tracker/components/AddTT'
import useApi from '@/services/useApi'
import { useCallback, useEffect, useState } from 'react'
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
  const {
    data: dataTT,
    call: callTT,
    loading: loadingTT,
  } = useApi('timeTrack', 'getAll')
  const { data: dataClient, call: callClient } = useApi('client', 'getAll', [])
  const { data: dataProject, call: callProject } = useApi(
    'project',
    'getAll',
    []
  )

  function getTTs(pageParam = 1, pageSizeParam = 10) {
    callTT(
      TableQueryParameters.create({
        sortBy: [{ column: 'date', direction: 'DESC' }],
        page: pageParam,
        pageSize: pageSizeParam,
      })
    )
  }

  useEffect(() => {
    callClient()
    callProject()
    getTTs()
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
          showLessItems: true,
          showTotal: total => `Total ${total} clients`,
          showSizeChanger: false,
          total: dataTT?.count,
          onChange: getTTs,
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
