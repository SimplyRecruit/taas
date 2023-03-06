import type { GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import AddTT from '@/pages/tracker/components/AddTT'
import useApi from '@/services/useApi'
import { useEffect } from 'react'
import { formatDate } from '@/util'
import { Table } from 'antd'
import { TT } from 'models'
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
  const {
    data: dataTT,
    setData: setDataTT,
    call: callTT,
    loading: loadingTT,
  } = useApi('timeTrack', 'getAll', [])
  const { data: dataClient, call: callClient } = useApi('client', 'getAll', [])
  const { data: dataProject, call: callProject } = useApi(
    'project',
    'getAll',
    []
  )

  useEffect(() => {
    callTT()
    callClient()
    callProject()
  }, [])

  function onAdd(newTT: TT) {
    setDataTT([...dataTT, newTT])
  }
  return (
    <>
      <div style={{ padding: 24 }}>
        <AddTT
          onAdd={onAdd}
          clientOptions={dataClient}
          projectOptions={dataProject}
        />
        <AddBatchTT clientOptions={dataClient} projectOptions={dataProject} />

        <Table
          size="large"
          scroll={{ x: 'max-content', y: 'calc(100vh - 320px)' }}
          loading={loadingTT}
          rowKey={record => record.id}
          columns={columns}
          dataSource={dataTT}
          pagination={{
            position: ['bottomCenter'],
            responsive: true,
            showQuickJumper: false,
            showLessItems: true,
            showTotal: total => `Total ${total} clients`,
            showSizeChanger: false,
          }}
        />
      </div>
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
