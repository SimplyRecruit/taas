import { Modal } from 'antd'
import Project from 'models/Project'

interface RenderProps {
  open: boolean
  project: Project | null
  onAdd: () => void
  onUpdate: () => void
  onCancel: () => void
}
export default function EditProjectModal({
  open,
  project,
  onAdd,
  onUpdate,
  onCancel,
}: RenderProps) {
  const onOk = () => {
    project ? onUpdate() : onAdd()
  }
  return (
    <Modal
      title={project ? 'Edit Project' : 'Add Project'}
      open={open}
      onOk={onOk}
      onCancel={onCancel}
    >
      {project?.client}
    </Modal>
  )
}
