import { createClient } from '@supabase/supabase-js'
import type { Database } from '../types/db'
import { getSupabaseEnv } from './env'

let _supabase: ReturnType<typeof createClient<Database>> | null = null

export function getSupabaseClient() {
  if (_supabase) return _supabase
  const { url, anonKey } = getSupabaseEnv()
  _supabase = createClient<Database>(url, anonKey)
  return _supabase
}

