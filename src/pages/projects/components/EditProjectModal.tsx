import { DatePicker, Dropdown, Modal, Select, Space } from 'antd'
import { Input } from 'antd'
import dayjs from 'dayjs'
import Project from 'models/Project'
import { useState } from 'react'

interface RenderProps {
  open: boolean
  project: Project | null
  onAdd: (project: Project) => void
  onUpdate: (project: Project) => void
  onCancel: () => void
}
export default function EditProjectModal({
  open,
  project,
  onAdd,
  onUpdate,
  onCancel,
}: RenderProps) {
  const [name, setName] = useState(project ? project.name : '')
  const [client, setClient] = useState(project ? project.client : '')
  const [startDate, setStartDate] = useState(
    project ? project.startDate : dayjs()
  )
  const onOk = () => {
    project
      ? onUpdate({
          id: project.id,
          name,
          client,
          startDate,
          active: project.active,
        })
      : onAdd({
          id: Math.random().toString(),
          name,
          client,
          startDate,
          active: true,
        })
  }
  return (
    <Modal
      title={project ? 'Edit Project' : 'Add Project'}
      open={open}
      onOk={onOk}
      onCancel={onCancel}
    >
      <Space direction="vertical">
        <Input
          placeholder="Project name"
          value={name}
          onChange={e => {
            setName(e.target.value)
          }}
        />
        <Select
          defaultValue="no-client"
          style={{ width: 120 }}
          onChange={e => setClient(e)}
        >
          <Select.Option value="no-client">No client</Select.Option>
          <Select.Option value="a101">A101</Select.Option>
          <Select.Option value="bim">BİM</Select.Option>
          <Select.Option value="sok">ŞOK</Select.Option>
        </Select>
        <DatePicker
          allowClear={false}
          value={startDate}
          onChange={e => setStartDate(e ? e : dayjs())}
        />
      </Space>
    </Modal>
  )
}
