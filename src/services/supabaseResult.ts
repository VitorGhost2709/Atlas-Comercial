import type { PostgrestError } from '@supabase/supabase-js'

function throwIfError(error: PostgrestError | null): void {
  if (error) throw error
}

export function unwrapList<T>(result: {
  data: T[] | null
  error: PostgrestError | null
}): T[] {
  throwIfError(result.error)
  return result.data ?? []
}

export function unwrapSingle<T>(result: {
  data: T | null
  error: PostgrestError | null
}): T | null {
  throwIfError(result.error)
  return result.data ?? null
}
