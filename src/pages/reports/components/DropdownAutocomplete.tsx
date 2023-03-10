import { AutoComplete, Popover } from 'antd'

import DropdownButton from '@/components/DropdownButton'

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
      <DropdownButton title={title} />
    </Popover>
  )
}
