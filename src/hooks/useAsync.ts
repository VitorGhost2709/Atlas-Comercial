import { useCallback, useEffect, useState } from 'react'

export type AsyncState<T> = {
  data: T | null
  loading: boolean
  error: unknown
  reload: () => void
}

export function useAsync<T>(fn: () => Promise<T>, deps: readonly unknown[]): AsyncState<T> {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<unknown>(null)
  const [reloadKey, setReloadKey] = useState(0)

  const reload = useCallback(() => {
    setReloadKey((k) => k + 1)
  }, [])

  useEffect(() => {
    let active = true
    setLoading(true)
    setError(null)

    fn()
      .then((result) => {
        if (!active) return
        setData(result)
      })
      .catch((err) => {
        if (!active) return
        setError(err)
      })
      .finally(() => {
        if (!active) return
        setLoading(false)
      })

    return () => {
      active = false
    }
  }, [...deps, reloadKey])

  return { data, loading, error, reload }
}

