import { MenuProps, Space } from 'antd'
import ActionMenu from '@/components/ActionMenu'
import { FileExcelOutlined } from '@ant-design/icons'
import useApi from '@/services/useApi'
import { TTGetAllParams } from 'models'

interface RenderProps {
  ttGetAllParams: TTGetAllParams
}

export default function TTTableActionHeader({ ttGetAllParams }: RenderProps) {
  const { call } = useApi('timeTrack', 'exportSpreadSheet')
  function onExport() {
    call(ttGetAllParams)
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
