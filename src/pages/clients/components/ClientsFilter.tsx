import Filter from '@/components/Filter'

interface RenderProps {
  onStatusChange: (value: string) => void
  onSearch: (value: string) => void
  searchText: string
}
const ClientsFilter = ({
  onStatusChange,
  onSearch,
  searchText,
}: RenderProps) => {
  const items = [
    { value: 'all', text: 'All' },
    { value: 'active', text: 'Active' },
    { value: 'inactive', text: 'Archived' },
  ]
  return (
    <Filter
      onStatusChange={onStatusChange}
      items={items}
      onSearch={onSearch}
      searchText={searchText}
      searchPlaceholder="Search by name"
      defaultStatus="active"
    />
  )
}

export default ClientsFilter
