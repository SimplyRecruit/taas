import { Button, Col, message, Row, Space, Spin, Typography } from 'antd'
import type { GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

import { ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons'
import { useEffect, useState } from 'react'
import MonthCard from '@/pages/periods/components/MonthCard'
import useApi from '@/services/useApi'
import { WorkPeriod } from 'models'
import { plainToClass } from 'class-transformer'
export default function PeriodsPage() {
  const {
    data,
    setData,
    call: callGetAll,
    loading: loadingGetAll,
    error,
  } = useApi('workPeriod', 'getAll', [])
  const { call: callDelete, loading: loadingDelete } = useApi(
    'workPeriod',
    'delete'
  )
  const { call: callCreate, loading: loadingCreate } = useApi(
    'workPeriod',
    'create'
  )
  const [year, setYear] = useState(new Date().getFullYear())
  const [messageApi, contextHolder] = message.useMessage()

  const loading = loadingGetAll || loadingDelete || loadingCreate
  function createBody(period: Date): WorkPeriod {
    return WorkPeriod.fromDate(period)
  }
  async function onToggleStatus(period: Date, active: boolean) {
    try {
      const body = createBody(period)
      if (active) {
        await callDelete(body)
        setData(
          data.filter(
            e =>
              plainToClass(WorkPeriod, e).periodDate.toISOString() !==
              period.toISOString()
          )
        )
        messageApi.success('Period deactivated successfully!')
      } else {
        await callCreate(body)
        setData([...data, body])
        messageApi.success('Period activated successfully!')
      }
    } catch {
      messageApi.error(
        active
          ? 'An error occured. Could not deactivate period.'
          : 'An error occured. Could not activate period.'
      )
    }
  }
  useEffect(() => {
    callGetAll()
  }, [])

  function getDate(monthIndex: number): Date {
    return new Date(Date.UTC(year, monthIndex, 1))
  }
  const cols = []
  const colCount = 4
  const rowCount = 3

  for (let i = 0; i < colCount * rowCount; i++) {
    cols.push(
      <Col key={i.toString()} span={24 / colCount}>
        <MonthCard
          date={getDate(i)}
          active={data.some(
            e =>
              plainToClass(WorkPeriod, e).periodDate.toISOString() ===
              getDate(i).toISOString()
          )}
          onToggleStatus={onToggleStatus}
        />
      </Col>
    )
  }
  return (
    <>
      {contextHolder}
      <Spin spinning={loading} size="large">
        <Space direction="vertical" size="large">
          <Space>
            <Button
              icon={<ArrowLeftOutlined />}
              shape="circle"
              type="text"
              size="small"
              onClick={() => setYear(year - 1)}
            />
            <Button
              icon={<ArrowRightOutlined />}
              shape="circle"
              type="text"
              size="small"
              onClick={() => setYear(year + 1)}
            />
            <Typography.Title level={4} style={{ margin: 0 }}>
              {year}
            </Typography.Title>
          </Space>
          <Row gutter={[20, 20]}>{cols}</Row>
        </Space>
      </Spin>
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
