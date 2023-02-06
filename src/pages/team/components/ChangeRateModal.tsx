import { Modal, InputNumber } from 'antd'
import { useState } from 'react'
interface RenderProps {
  open: boolean
  record: any
  setOpen: (isOpen: boolean) => void
  onOk: (record: any, rate: number) => void
}
const EditRateModal = ({ open, setOpen, record, onOk }: RenderProps) => {
  const [rate, setRate] = useState(record?.hourlyRate)

  const handleOk = () => {
    onOk(record, rate)
    onCancel()
  }

  const onCancel = () => {
    setOpen(false)
  }
  return (
    <Modal
      title="Edit Hourly Rate"
      open={open}
      onOk={handleOk}
      onCancel={onCancel}
    >
      <InputNumber
        value={rate}
        onChange={value => (value ? setRate(value) : setRate(0))}
        style={{ width: '100%' }}
      />
    </Modal>
  )
}

export default EditRateModal
