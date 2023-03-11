import type { GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useEffect } from 'react'
import { each, groupBy } from '@antv/util'
import dynamic from 'next/dynamic'
import { ColumnConfig } from '@ant-design/plots/es/components/column'
import useApi from '@/services/useApi'
import { ReportReqBody } from 'models'
import { momentToDate } from '@/util'
import ReportsFilter from '@/pages/reports/components/ReportsFilter'
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
  const config: ColumnConfig = {
    data,
    isStack: true,
    xField: 'date',
    yField: 'totalHours',
    seriesField: 'billable',
    loading,
    xAxis: {
      label: {
        formatter(text) {
          return new Date(text).toDateString()
        },
      },
    },
    legend: {
      slidable: false,
    },
    label: {
      layout: [
        {
          type: 'interval-adjust-position',
        },
        {
          type: 'interval-hide-overlap',
        },
        {
          type: 'adjust-color',
        },
      ],
    },
    annotations,
  }
  function getReport(values: ReportReqBody) {
    if (values) {
      console.log(values)
      call(values)
    }
  }

  return (
    <>
      <ReportsFilter onFilter={getReport}></ReportsFilter>
      <ColumnChart {...config} style={{ margin: 20 }} />
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
