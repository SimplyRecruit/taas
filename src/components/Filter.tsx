import { Input, Select, Space } from 'antd'
import { SearchOutlined } from '@ant-design/icons'

interface StatusItem {
  value: string
  text: string
}

interface RenderProps {
  onStatusChange: (value: string) => void
  items?: StatusItem[]
  defaultStatus?: string
  onSearch: (value: string) => void
  searchText: string
  searchPlaceholder: string
}
const Filter = ({
  onStatusChange,
  defaultStatus = 'all',
  items = [
    { value: 'all', text: 'Show all' },
    { value: 'active', text: 'Show active' },
    { value: 'inactive', text: 'Show inactive' },
  ],
  onSearch,
  searchText,
  searchPlaceholder,
}: RenderProps) => {
  return (
    <Space size="small">
      <Select
        defaultValue={defaultStatus}
        onChange={onStatusChange}
        style={{ minWidth: '17ch' }}
      >
        {items.map(({ value, text }) => (
          <Select.Option value={value} key={value}>
            {text}
          </Select.Option>
        ))}
      </Select>
      <Input
        prefix={<SearchOutlined />}
        allowClear
        placeholder={searchPlaceholder}
        value={searchText}
        onChange={e => onSearch(e.target.value)}
        style={{ width: 200 }}
      />
    </Space>
  )
}

export default Filter
