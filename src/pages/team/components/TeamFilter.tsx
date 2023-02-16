import Filter from '@/components/Filter'

interface RenderProps {
  onStatusChange: (value: string) => void
  onSearch: (value: string) => void
  searchText: string
}
const TeamFilter = ({ onStatusChange, onSearch, searchText }: RenderProps) => {
  return (
    <Filter
      onStatusChange={onStatusChange}
      onSearch={onSearch}
      searchText={searchText}
      searchPlaceholder="Search by name"
    />
  )
}

export default TeamFilter
