import { Badge, Popover } from 'antd'

import DropdownActivator from '@/components/DropdownActivator'
import PopoverContent from '@/pages/reports/components/PopoverContent'
import { useState } from 'react'

type OptionType = {
  value: string
  label: string
}

interface RenderProps {
  onChange: (value: string[]) => void
  onSave: () => void
  options?: OptionType[]
  title: string
  searchable?: boolean
  badgeCount: number
}

export default function DropdownAutocomplete({
  badgeCount,
  onSave,
  ...props
}: RenderProps) {
  const [open, setOpen] = useState(false)
  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    if (!newOpen) onSave() // save on focus out
  }
  const hide = () => {
    setOpen(false)
    onSave()
  }

  return (
    <Popover
      arrow={false}
      placement="bottomLeft"
      trigger="click"
      open={open}
      onOpenChange={handleOpenChange}
      content={<PopoverContent onSave={hide} {...props} />}
    >
      <Badge count={badgeCount} overflowCount={9}>
        <DropdownActivator title={props.title} />
      </Badge>
    </Popover>
  )
}
