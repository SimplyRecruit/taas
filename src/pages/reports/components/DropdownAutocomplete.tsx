import { AutoComplete, Popover } from 'antd'

import DropdownActivator from '@/components/DropdownActivator'

type OptionType = {
  value: string
  label: string
}

interface RenderProps {
  onChange?: (value: string) => void
  options?: OptionType[]
  title: string
}

export default function DropdownAutocomplete({
  onChange,
  options,
  title,
}: RenderProps) {
  return (
    <Popover
      placement="bottomLeft"
      trigger="click"
      content={
        <AutoComplete
          onChange={onChange}
          placeholder={'Search ' + title.toLocaleLowerCase()}
          style={{ width: 200 }}
          options={options}
        />
      }
    >
      <DropdownActivator title={title} />
    </Popover>
  )
}
