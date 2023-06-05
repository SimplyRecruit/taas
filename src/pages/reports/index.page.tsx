import type { GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useMemo } from 'react'
import { each, groupBy } from '@antv/util'
import dynamic from 'next/dynamic'
import type { ColumnConfig } from '@ant-design/plots/es/components/column'
import useApi from '@/services/useApi'
import { ReportReqBody } from 'models'
import ReportsFilter from '@/pages/reports/components/ReportsFilter'
import { Card, Space, Spin } from 'antd'
import { baseConfig } from '@/pages/reports/components/constants'
import { formatDate } from '@/util'
import { useTranslation } from 'next-i18next'
const ColumnChart = dynamic(
  () => import('@ant-design/plots').then(({ Column }) => Column),
  { ssr: false }
)

export default function ReportsPage() {
  const { t } = useTranslation('reports')
  const { data, call, loading } = useApi('report', 'get', [])

  const config: ColumnConfig = useMemo(() => {
    const annotations: any = []
    each(groupBy(data, 'date'), (values, k) => {
      const value = values.reduce((a: any, b: any) => a + b.totalHours, 0)
      annotations.push({
        type: 'text',
        position: [k, value],
        content: `${value}`,
        style: {
          textAlign: 'center',
          fontSize: 14,
          fill: 'rgba(0,0,0,0.85)',
        },
        offsetY: -10,
      })
    })
    return {
      ...baseConfig,
      data: data.map(e => {
        console.log(e)
        return {
          ...e,
          date: formatDate(new Date(e.date)),
          billable: e.billable ? 'billable' : 'not billable',
        }
      }),
      annotations,
    }
  }, [data])

  function getReport(values: ReportReqBody) {
    if (values) {
      call(values)
    }
  }

  return (
    <>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <ReportsFilter onFilter={getReport} />
        <Card
          bodyStyle={{
            height: 448,
            textAlign: 'center',
          }}
        >
          <Spin spinning={loading} size="large">
            <ColumnChart {...config} />
          </Spin>
        </Card>
      </Space>
    </>
  )
}
export const getStaticProps: GetStaticProps = async ({ locale }) => {
  locale ??= 'en'
  return {
    props: {
      ...(await serverSideTranslations(locale, ['reports', 'common'])),
    },
  }
}
