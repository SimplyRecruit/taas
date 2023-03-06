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
  U extends keyof (typeof apis)[T],
  D extends ApiReturnType<T, U> | null
>(api: T, method: U, defaultValue?: D) {
  type StateType = D extends null | undefined
    ? ApiReturnType<T, U> | null
    : ApiReturnType<T, U>
  const [data, setData] = useState<StateType>(defaultValue ?? (null as any))
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
      setData(data as StateType)
      setError(null)
      return data
    } catch (e: any) {
      setData(defaultValue as StateType)
      setError(e)
      throw e
    } finally {
      setLoading(false)
    }
  }

  return { data, loading, error, call, setData }
}
