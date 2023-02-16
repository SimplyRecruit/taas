import { Input, Select, Space } from 'antd'
import { SearchOutlined } from '@ant-design/icons'

interface RenderProps {
  onStatusChange: (value: string) => void
  onSearch: (value: string) => void
  searchText: string
}
const Filter = ({ onStatusChange, onSearch, searchText }: RenderProps) => {
  const items = [
    { value: 'all', text: 'Show all' },
    { value: 'active', text: 'Show active' },
    { value: 'inactive', text: 'Show inactive' },
  ]
  return (
    <Space size="small">
      <Select
        defaultValue="all"
        style={{ width: '17ch' }}
        onChange={onStatusChange}
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
        placeholder="Search by name"
        value={searchText}
        onChange={e => onSearch(e.target.value)}
        style={{ width: 200 }}
      />
    </Space>
  )
}

export default Filter
