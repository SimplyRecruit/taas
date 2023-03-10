import { Checkbox, Input } from 'antd'
import { useState } from 'react'

import styles from './index.module.css'

type OptionType = {
  value: string
  label: string
}

interface RenderProps {
  onChange?: (value: string) => void
  options?: OptionType[]
  title: string
}

export default function PopoverContent({
  onChange,
  options,
  title,
}: RenderProps) {
  const [searchText, setSearchText] = useState('')
  const filteredOptions = options?.filter(option =>
    (option?.label ?? '').toLowerCase().includes(searchText.toLowerCase())
  )
  return (
    <div className={styles.wrapper}>
      <Input
        value={searchText}
        onChange={e => setSearchText(e.target.value)}
        placeholder={'Search ' + title.toLocaleLowerCase()}
      />
      <Checkbox.Group
        options={filteredOptions}
        onChange={e => {
          console.log(e)
        }}
      ></Checkbox.Group>
    </div>
  )
}
