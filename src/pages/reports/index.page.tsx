import type { GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useEffect, useState } from 'react'
import { each, groupBy } from '@antv/util'
import dynamic from 'next/dynamic'
import { ColumnConfig } from '@ant-design/plots/es/components/column'
const ColumnChart = dynamic(
  () => import('@ant-design/plots').then(({ Column }) => Column),
  { ssr: false }
)
export default function ReportsPage() {
  const [data, setData] = useState([])

  useEffect(() => {
    asyncFetch()
  }, [])

  const asyncFetch = () => {
    fetch(
      'https://gw.alipayobjects.com/os/antfincdn/8elHX%26irfq/stack-column-data.json'
    )
      .then(response => response.json())
      .then(json => setData(json))
      .catch(error => {
        console.log('fetch data failed', error)
      })
  }
  const annotations: any = []
  each(groupBy(data, 'year'), (values, k) => {
    const value = values.reduce((a: any, b: any) => a + b.value, 0)
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
    xField: 'year',
    yField: 'value',
    seriesField: 'type',
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
    annotations,
  }

  return (
    <>
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
