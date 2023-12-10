import { Radio, Space, Typography } from 'antd'
import Search from '@/components/Search'

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
  defaultStatus = 'active',
  items = [
    { value: 'all', text: 'All' },
    { value: 'active', text: 'Active' },
    { value: 'inactive', text: 'Archived' },
  ],
  onSearch,
  searchText,
  searchPlaceholder,
}: RenderProps) => {
  return (
    <Space size="small">
      <Typography.Text>Show</Typography.Text>
      <Radio.Group
        optionType="button"
        buttonStyle="solid"
        defaultValue={defaultStatus}
        onChange={e => onStatusChange(e.target.value)}
        style={{ minWidth: '17ch' }}
      >
        {items.map(({ value, text }) => (
          <Radio value={value} key={value}>
            {text}
          </Radio>
        ))}
      </Radio.Group>
      <Search
        onChange={onSearch}
        placeholder={searchPlaceholder}
        value={searchText}
      />
    </Space>
  )
}

export default Filter
