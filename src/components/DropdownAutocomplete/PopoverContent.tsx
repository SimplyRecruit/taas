import { Button, Checkbox, Input, Space } from 'antd'
import type { CheckboxValueType } from 'antd/es/checkbox/Group'
import { useState } from 'react'

import styles from './index.module.css'

type OptionType = {
  value: string
  label: string
}

interface RenderProps {
  onChange?: (value: string[]) => void
  onSave?: () => void
  onReset?: () => void
  value?: string[]
  options?: OptionType[]
  title: string
  searchable?: boolean
  actionButtons?: boolean
}

export default function PopoverContent({
  onChange,
  onSave,
  onReset,
  value,
  searchable = true,
  options,
  title,
  actionButtons = false,
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
        value={value}
        style={{ maxHeight: 300, overflowY: 'auto' }}
        options={filteredOptions}
        onChange={onChange as (value: CheckboxValueType[]) => void}
      />
      {actionButtons && (
        <Space>
          <Button onClick={onSave} type="primary" size="small">
            Save
          </Button>
          <Button onClick={onReset} size="small" type="link">
            Reset
          </Button>
        </Space>
      )}
    </Space>
  )
}
