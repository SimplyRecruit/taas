import { Popover } from 'antd'

import DropdownActivator from '@/components/DropdownActivator'
import PopoverContent from '@/pages/reports/components/PopoverContent'

type OptionType = {
  value: string
  label: string
}

interface RenderProps {
  onChange?: (value: string) => void
  options?: OptionType[]
  title: string
  searchable?: boolean
}

export default function DropdownAutocomplete(props: RenderProps) {
  return (
    <Popover
      arrow={false}
      placement="bottomLeft"
      trigger="click"
      content={<PopoverContent {...props} />}
    >
      <DropdownActivator title={props.title} />
    </Popover>
  )
}
