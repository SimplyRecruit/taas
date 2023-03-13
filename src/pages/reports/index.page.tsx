import type { GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useEffect, useMemo } from 'react'
import { each, groupBy } from '@antv/util'
import dynamic from 'next/dynamic'
import type { ColumnConfig } from '@ant-design/plots/es/components/column'
import useApi from '@/services/useApi'
import { ReportReqBody } from 'models'
import ReportsFilter from '@/pages/reports/components/ReportsFilter'
import { Spin } from 'antd'
import { baseConfig } from '@/pages/reports/components/constants'
const ColumnChart = dynamic(
  () => import('@ant-design/plots').then(({ Column }) => Column),
  { ssr: false }
)

export default function ReportsPage() {
  const { data, call, loading } = useApi('report', 'get', [])

  useEffect(() => {
    call(
      ReportReqBody.create({
        from: new Date(Date.now() - 86400000),
        to: new Date(),
      })
    )
  }, [])

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
      data,
      annotations,
    }
  }, [data])

  function getReport(values: ReportReqBody) {
    if (values) {
      console.log(values)
      call(values)
    }
  }

  return (
    <>
      <ReportsFilter onFilter={getReport} />
      <Spin spinning={loading}>
        <ColumnChart {...config} style={{ margin: 20 }} />
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
