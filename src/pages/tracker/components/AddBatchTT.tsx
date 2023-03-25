import { Button, Collapse, Modal, Spin, Table, Tooltip } from 'antd'
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons'
import { ClientRelation, ProjectRelation, TTBatchCreateBody } from 'models'
import { formatDate } from '@/util'
import useApi from '@/services/useApi'
import {
  JSXElementConstructor,
  ReactElement,
  ReactFragment,
  ReactPortal,
  useState,
} from 'react'
import BatchSpreadSheet from '@/pages/tracker/components/BatchSpreadSheet'
import { RenderFunction } from 'antd/es/tooltip'

interface Props {
  projectOptions?: ProjectRelation[]
  clientOptions?: ClientRelation[]
  onAdd: () => void
  onCancel?: () => void
}
export default function AddBatchTT({
  projectOptions,
  clientOptions,
  onAdd,
}: Props) {
  const [showResultsModal, setShowResultsModal] = useState(false)
  const [batch, setBatch] = useState<TTBatchCreateBody | null>(null)
  const [ssData, setSsData] = useState<any[][]>([[]])
  const [errorExists, setErrorExists] = useState(false)
  const {
    call: callBatchCreate,
    data: dataBatchCreate,
    loading: loadingBatchCreate,
    error: errorBatchCreate,
  } = useApi('timeTrack', 'batchCreate', [])

  async function performBatchCreation() {
    try {
      if (batch === null) return
      setShowResultsModal(true)
      await callBatchCreate(batch)
      onAdd()
    } catch (error) {
      /* empty */
    }
    return
  }

  const columns: any = [
    {
      title: '#',
      key: 'index',
      render: (_text: any, _record: any, index: number) => index + 1,
    },
    {
      title: 'Date',
      dataIndex: '0',
      key: 'date',
      render: (value: Date) => <span>{formatDate(value)}</span>,
    },
    {
      title: 'Client',
      dataIndex: '1',
      key: 'client',
    },
    {
      title: 'Hour',
      dataIndex: '2',
      key: 'hour',
    },
    {
      title: 'Description',
      dataIndex: '3',
      key: 'description',
    },
    {
      title: 'Billabe',
      dataIndex: '4',
      key: 'billable',
      render: (value: any) => (value ? 'YES' : 'NO'),
    },
    {
      title: 'Ticket no',
      dataIndex: '5',
      key: 'ticketNo',
    },
    {
      title: 'Project',
      dataIndex: '6',
      key: 'project',
    },
    {
      title: 'Result',
      key: 'succeeded',
      dataIndex: 'succeeded',
      render: (
        value: any,
        record: {
          error:
            | string
            | number
            | boolean
            | ReactElement<any, string | JSXElementConstructor<any>>
            | ReactFragment
            | ReactPortal
            | RenderFunction
            | null
            | undefined
        }
      ) =>
        value ? (
          <Tooltip placement="right" title="Success">
            <CheckCircleOutlined style={{ fontSize: 18, color: '#0a0' }} />
          </Tooltip>
        ) : (
          <Tooltip placement="right" title={record.error}>
            <CloseCircleOutlined style={{ fontSize: 18, color: '#a00' }} />
          </Tooltip>
        ),
    },
  ]

  return (
    <>
      <Collapse style={{ marginTop: 10, marginBottom: 10 }}>
        <Collapse.Panel header="Batch Addition" key="1">
          {clientOptions && projectOptions && (
            <>
              <BatchSpreadSheet
                ssData={ssData}
                onChange={(body, error) => {
                  setBatch(body)
                  setErrorExists(error)
                }}
                clientAbbrs={clientOptions.map(e => e.abbr)}
                projectAbbrs={projectOptions.map(e => e.abbr)}
              />
              <AddButton />
            </>
          )}
        </Collapse.Panel>
      </Collapse>
      <Modal
        width={1000}
        closable={false}
        maskClosable={false}
        open={showResultsModal}
        title="Batch Creation"
        footer={
          !loadingBatchCreate && [
            <CloseButton key="close" />,
            <ClearAndCloseButton key="clear" />,
          ]
        }
      >
        {loadingBatchCreate ? (
          <LoadingComponent />
        ) : errorBatchCreate ? (
          <ErrorComponent />
        ) : (
          <ResultsTable />
        )}
      </Modal>
    </>
  )

  function AddButton() {
    return (
      <Button
        style={{ marginTop: 10 }}
        type="primary"
        disabled={batch === null || !batch.bodies.length || errorExists}
        onClick={performBatchCreation}
      >
        Batch Add
      </Button>
    )
  }

  function ErrorComponent() {
    return (
      <div>
        Wrong data format. Check if all requirements of columns are satisfied
      </div>
    )
  }

  function ResultsTable() {
    return (
      <Table
        dataSource={dataBatchCreate.map((e, i) => ({ ...e, ...ssData[i] }))}
        rowKey={(_r, i) => `result-${i}`}
        columns={columns}
        pagination={false}
      />
    )
  }

  function LoadingComponent() {
    return (
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Spin tip="Performing Batch Creation" />
      </div>
    )
  }

  function CloseButton({ reset = false }: { reset?: boolean }) {
    return (
      <Button
        onClick={() => {
          if (reset) setSsData([[]])
          setShowResultsModal(false)
        }}
      >
        Close
      </Button>
    )
  }

  function ClearAndCloseButton() {
    if (errorBatchCreate) return null
    return (
      <Button
        type="primary"
        onClick={() => {
          const indicesOfFailedRows = dataBatchCreate.reduce<number[]>(
            (p, c, i) => (c.error ? [...p, i] : p),
            []
          )
          const newSsData = ssData.filter((_e, i) =>
            indicesOfFailedRows.includes(i)
          )
          if (!newSsData.length) newSsData.push([])
          setSsData(newSsData)
          setShowResultsModal(false)
        }}
      >
        Clear Processed and Close
      </Button>
    )
  }
}
