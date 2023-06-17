import { useState } from 'react'
import Cookies from 'universal-cookie'

export default function useCookie<T>(key: string, defaultValue?: T) {
  const cookies = new Cookies()
  const [data, setData] = useState<T>(cookies.get(key) ?? defaultValue ?? null)
  function persistData(data: T) {
    cookies.set(key, data)
    setData(data)
  }
  return [data, persistData] as const
}
