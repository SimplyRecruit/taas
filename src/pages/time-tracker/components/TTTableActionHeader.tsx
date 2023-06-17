import { MenuProps, Space } from 'antd'
import ActionMenu from '@/components/ActionMenu'
import { FileExcelOutlined } from '@ant-design/icons'
import useApi from '@/services/useApi'
import { TTGetAllParams } from 'models'
import { downloadFile } from '@/util'

interface RenderProps {
  ttGetAllParams: TTGetAllParams
}

export default function TTTableActionHeader({ ttGetAllParams }: RenderProps) {
  const { call } = useApi('timeTrack', 'exportSpreadSheet')
  async function onExport() {
    const blob = await call(ttGetAllParams)
    downloadFile(blob, 'activities.xlsx')
  }
  const menuItems: MenuProps['items'] = [
    {
      key: 'delete',
      icon: <FileExcelOutlined />,
      label: 'Export as Excel',
      onClick: onExport,
    },
  ]

  return (
    <Space>
      <ActionMenu items={menuItems} />
    </Space>
  )
}
