import { Button, Card, Col, Row, Space, Tag, Typography } from 'antd'
import type { GetStaticProps } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

import { ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons'
import { useState } from 'react'
import MonthCard from '@/pages/periods/components/MonthCard'
export default function PeriodsPage() {
  const [activePeriods, setValues] = useState<Date[]>([])
  const [year, setYear] = useState(new Date().getFullYear())
  function getDate(monthIdx: number): Date {
    return new Date(year, monthIdx, 1)
  }
  const cols = []
  const colCount = 4
  const rowCount = 3
  for (let i = 0; i < colCount * rowCount; i++) {
    cols.push(
      <Col key={i.toString()} span={24 / colCount}>
        <MonthCard
          date={getDate(i)}
          active={activePeriods.includes(getDate(i))}
        />
      </Col>
    )
  }
  return (
    <>
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
