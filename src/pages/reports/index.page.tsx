import type { GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import type { Dayjs } from 'dayjs'
import { each, groupBy } from '@antv/util'
import dynamic from 'next/dynamic'
import { ColumnConfig } from '@ant-design/plots/es/components/column'
import useApi from '@/services/useApi'
import { ReportReqBody } from 'models'
import { DatePicker } from 'antd'
import { momentToDate } from '@/util'
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

  // const annotations: any = []
  // each(groupBy(data, 'year'), (values, k) => {
  //   const value = values.reduce((a: any, b: any) => a + b.value, 0)
  //   annotations.push({
  //     type: 'text',
  //     position: [k, value],
  //     content: `${value}`,
  //     style: {
  //       textAlign: 'center',
  //       fontSize: 14,
  //       fill: 'rgba(0,0,0,0.85)',
  //     },
  //     offsetY: -10,
  //   })
  // })
  const config: ColumnConfig = {
    data,
    isStack: false,
    xField: 'date',
    yField: 'totalHours',
    loading,
    label: {
      layout: [
        {
          type: 'interval-adjust-position',
        }, // 数据标签防遮挡
        {
          type: 'interval-hide-overlap',
        }, // 数据标签文颜色自动调整
        {
          type: 'adjust-color',
        },
      ],
    },
    slider: {
      start: 0,
      end: 1,
    },
  }
  function getReport(values: any) {
    if (values) {
      call(
        ReportReqBody.create({
          from: momentToDate(values[0]),
          to: momentToDate(values[1]),
        })
      )
    }
  }
  const rangePresets: {
    label: string
    value: [Dayjs, Dayjs]
  }[] = [
    { label: 'Today', value: [dayjs(), dayjs()] },
    { label: 'Yesterday', value: [dayjs().add(-1, 'd'), dayjs()] },
    { label: 'This week', value: [dayjs().add(-7, 'd'), dayjs()] },
    { label: 'Last week', value: [dayjs().add(-7, 'd'), dayjs()] },
    { label: 'Past 2 weeks', value: [dayjs().add(-7, 'd'), dayjs()] },
    { label: 'This month', value: [dayjs().add(-14, 'd'), dayjs()] },
    { label: 'Last month', value: [dayjs().add(-30, 'd'), dayjs()] },
    { label: 'This year', value: [dayjs().add(-90, 'd'), dayjs()] },
    { label: 'Last year', value: [dayjs().add(-90, 'd'), dayjs()] },
  ]
  return (
    <>
      <DatePicker.RangePicker presets={rangePresets} onChange={getReport} />
      <ColumnChart {...config} />
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
