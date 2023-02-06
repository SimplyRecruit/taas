/* eslint-disable @typescript-eslint/no-explicit-any */
import apis from '@/services/apis'
import { AxiosResponse } from 'axios'
import { useState } from 'react'

type ApiFunctionType<T> = T extends (...args: infer U) => any ? U : never

export default function useApi<
  T extends keyof typeof apis,
  U extends keyof (typeof apis)[T]
>(api: T, method: U) {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const call = async (...args: ApiFunctionType<(typeof apis)[T][U]>) => {
    setLoading(true)
    try {
      const { data } = await (
        apis[api][method] as (
          ...args: ApiFunctionType<(typeof apis)[T][U]>
        ) => Promise<AxiosResponse>
      )(...args)
      setData(data)
      setError(null)
    } catch (e: any) {
      setData(null)
      setError(e)
    } finally {
      setLoading(false)
    }
  }

  return { data, loading, error, call }
}
