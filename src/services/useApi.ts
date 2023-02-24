/* eslint-disable @typescript-eslint/no-explicit-any */
import apis from '@/services/apis'
import type { AxiosResponse } from 'axios'
import { useState } from 'react'

type StripAxiosResponse<T> = T extends AxiosResponse<infer U> ? U : T
type ApiFunctionType<T> = T extends (...args: infer U) => any ? U : never
type ApiReturnType<
  T extends keyof typeof apis,
  U extends keyof (typeof apis)[T]
> = (typeof apis)[T][U] extends (...args: any[]) => any
  ? StripAxiosResponse<Awaited<ReturnType<(typeof apis)[T][U]>>>
  : (typeof apis)[T][U]

export default function useApi<
  T extends keyof typeof apis,
  U extends keyof (typeof apis)[T]
>(api: T, method: U) {
  const [data, setData] = useState<ApiReturnType<T, U> | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const call = async (...args: ApiFunctionType<(typeof apis)[T][U]>) => {
    setLoading(true)
    try {
      const { data } = await (
        apis[api][method] as (
          ...args: ApiFunctionType<(typeof apis)[T][U]>
        ) => Promise<AxiosResponse<ApiReturnType<T, U>>>
      )(...args)
      setData(data)
      setError(null)
      return data
    } catch (e: any) {
      setData(null)
      setError(e)
      throw e
    } finally {
      setLoading(false)
    }
  }

  return { data, loading, error, call, setData }
}
