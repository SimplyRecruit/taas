import { Badge, Popover } from 'antd'

import DropdownActivator from '@/components/DropdownActivator'
import PopoverContent from '@/components/DropdownAutocomplete/PopoverContent'
import { useState } from 'react'

type OptionType = {
  value: string
  label: string
}

interface RenderProps {
  onChange: (value: string[]) => void
  options?: OptionType[]
  title: string
  searchable?: boolean
  badgeCount: number
}

export default function DropdownAutocomplete({
  badgeCount,
  ...props
}: RenderProps) {
  return (
    <Popover
      arrow={false}
      placement="bottomLeft"
      trigger="click"
      content={<PopoverContent {...props} />}
    >
      <Badge count={badgeCount} overflowCount={9}>
        <DropdownActivator title={props.title} />
      </Badge>
    </Popover>
  )
}
