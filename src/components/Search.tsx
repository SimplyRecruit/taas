import { Button, Input, Space } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import { type ChangeEvent, useState, useEffect, KeyboardEvent } from 'react'

interface RenderProps {
  value?: string
  placeholder?: string
  onChange?: (value: string) => void
  onSearch?: (value: string) => void
  withButton?: boolean
}

/**
 * * **value** - default: `''`
 * * **placeholder** - default: `'Search'`
 * * **withButton**: Put a button at the end of the input - default: `false`
 * * **onChange**: If provided, emits value inside input on every keystroke
 * * **onSearch**: If provided, emits value inside input on every time search button is clicked or key 'Enter' is pressed
 */
function Search(props: RenderProps) {
  // Hooks
  const [localValue, setLocalValue] = useState(props.value ?? '')
  useEffect(() => {
    if (props.value) setLocalValue(props.value)
  }, [props.value])

  // Handlers
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value)
    setLocalValue(e.target.value)
    props.onChange?.(e.target.value)
  }
  const handleButtonClick = () => {
    props.onSearch?.(localValue)
  }
  const handleEnterKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') props.onSearch?.(localValue)
  }

  // Default values
  const { placeholder = 'Search', withButton = false } = props

  // HTML
  const Shared = (
    <Input
      prefix={<SearchOutlined />}
      allowClear
      placeholder={placeholder}
      value={localValue}
      onChange={handleChange}
      onKeyDown={handleEnterKeyDown}
      style={{ width: 200 }}
    />
  )
  if (withButton) {
    return (
      <Space size="small">
        {Shared}
        <Button onClick={handleButtonClick} icon={<SearchOutlined />} />
      </Space>
    )
  } else return <>{Shared}</>
}

export default Search
