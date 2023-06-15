import { MenuProps, Space } from 'antd'
import ActionMenu from '@/components/ActionMenu'
import { FileExcelOutlined } from '@ant-design/icons'
import useApi from '@/services/useApi'

export default function TTTableActionHeader() {
  const { call } = useApi('timeTrack', 'exportSpreadSheet')
  function onExport() {
    console.log('Export')
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
