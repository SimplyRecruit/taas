import { Button, DatePicker, Input, List } from 'antd'
import { PlusCircleOutlined } from '@ant-design/icons'
import { useState } from 'react'
import { RxLapTimer } from 'react-icons/rx'
import { TbCurrencyLira } from 'react-icons/tb'
import { FiCalendar } from 'react-icons/fi'

interface RenderProps {
  item: any
}

export default function TrackerListItem({ item }: RenderProps) {
  const [datePickerOpen, setDatePickerOpen] = useState(false)
  const [isBillable, setIsBillable] = useState(false)
  return (
    <>
      <List.Item>
        <Input
          bordered={true}
          style={{ minWidth: 100, width: '50%' }}
          value={item}
        ></Input>
        <Button type="text">
          <PlusCircleOutlined />
          Project
        </Button>
        <div>
          <DatePicker
            style={{ maxWidth: '8ch' }}
            allowClear={false}
            format={'HH:mm'}
            placeholder="Start time"
            picker="time"
            suffixIcon={null}
          ></DatePicker>
          <span style={{ marginLeft: 8, marginRight: 8 }}>–</span>
          <DatePicker
            style={{ maxWidth: '8ch' }}
            allowClear={false}
            format={'HH:mm'}
            placeholder="Start time"
            picker="time"
            suffixIcon={null}
          ></DatePicker>
        </div>

        <div style={{ position: 'relative', cursor: 'pointer' }}>
          <FiCalendar
            style={{
              fontSize: '125%',
              position: 'absolute',
              top: '30%',
              left: '20%',
            }}
            onClick={() => {
              setDatePickerOpen(!datePickerOpen)
            }}
          />
          <DatePicker
            style={{ visibility: 'hidden', width: 20, backgroundColor: 'red' }}
            onBlur={() => setDatePickerOpen(false)}
            onChange={() => setDatePickerOpen(false)}
            open={datePickerOpen}
          />
        </div>
        <TbCurrencyLira
          style={{ cursor: 'pointer', fontWeight: 800 }}
          onClick={() => setIsBillable(!isBillable)}
          color={isBillable ? '#3f3f3f' : 'lightgrey'}
          size={24}
        ></TbCurrencyLira>
        <DatePicker
          style={{ maxWidth: '11ch' }}
          allowClear={false}
          format={'HH:mm'}
          placeholder="Total time"
          picker="time"
          suffixIcon={<RxLapTimer color="#3f3f3f" size={18}></RxLapTimer>}
        />
      </List.Item>
    </>
  )
}
