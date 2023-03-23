import { Badge, Popover } from 'antd'

import DropdownActivator from '@/components/DropdownActivator'
import PopoverContent from '@/components/DropdownAutocomplete/PopoverContent'
import React, { ReactNode } from 'react'

type OptionType = {
  value: string
  label: string
}

interface RenderProps {
  onChange?: (value: string[]) => void
  onSave?: () => void
  onReset?: () => void
  options?: OptionType[]
  title: string
  searchable?: boolean
  actionButtons?: boolean
  badgeCount?: number
  children?: ReactNode
}

const Activator = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>
}

const DropdownAutocomplete = ({
  badgeCount,
  children,
  ...props
}: RenderProps) => {
  let activator: ReactNode

  React.Children.map(children, child => {
    if (React.isValidElement(child) && child.type === Activator) {
      activator = child
    }
  })
  console.log(children, activator)
  return (
    <Popover
      arrow={false}
      placement="bottomLeft"
      trigger="click"
      content={<PopoverContent {...props} />}
    >
      {
        <Badge count={badgeCount} overflowCount={9}>
          {activator ?? <DropdownActivator title={props.title} />}
        </Badge>
      }
    </Popover>
  )
}

DropdownAutocomplete.Activator = Activator

export default DropdownAutocomplete
