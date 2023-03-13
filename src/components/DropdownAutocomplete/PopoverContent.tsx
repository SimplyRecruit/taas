import { Button, Checkbox, Input, Space } from 'antd'
import type { CheckboxValueType } from 'antd/es/checkbox/Group'
import { useState } from 'react'

import styles from './index.module.css'

type OptionType = {
  value: string
  label: string
}

interface RenderProps {
  onChange: (value: string[]) => void
  options?: OptionType[]
  title: string
  searchable?: boolean
}

export default function PopoverContent({
  onChange,
  searchable = true,
  options,
  title,
}: RenderProps) {
  const [searchText, setSearchText] = useState('')
  const filteredOptions = searchable
    ? options?.filter(option =>
        (option?.label ?? '').toLowerCase().includes(searchText.toLowerCase())
      )
    : options
  return (
    <Space className={styles.wrapper} direction="vertical">
      {searchable && (
        <Input
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
          placeholder={'Search ' + title.toLocaleLowerCase()}
        />
      )}
      <Checkbox.Group
        options={filteredOptions}
        onChange={onChange as (value: CheckboxValueType[]) => void}
      />
    </Space>
  )
}
