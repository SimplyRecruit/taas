import { Badge, Popover } from 'antd'

import DropdownActivator from '@/components/DropdownActivator'
import PopoverContent from '@/components/DropdownAutocomplete/PopoverContent'
import { useState } from 'react'

type OptionType = {
  value: string
  label: string
}

interface RenderProps {
  onSave: (value: string[]) => void
  options?: OptionType[]
  title: string
  searchable?: boolean
}

export default function DropdownAutocomplete({
  onSave,
  ...props
}: RenderProps) {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState<string[]>([])
  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    if (!newOpen) onSave(selected) // save on focus out
  }
  const saveAndHide = () => {
    setOpen(false)
    onSave(selected)
  }

  return (
    <Popover
      arrow={false}
      placement="bottomLeft"
      trigger="click"
      open={open}
      onOpenChange={handleOpenChange}
      content={
        <PopoverContent
          onChange={setSelected}
          onSave={saveAndHide}
          {...props}
        />
      }
    >
      <Badge count={selected.length} overflowCount={9}>
        <DropdownActivator title={props.title} />
      </Badge>
    </Popover>
  )
}
