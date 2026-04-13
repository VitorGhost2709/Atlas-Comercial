export type AppEnv = {
  VITE_SUPABASE_URL?: string
  VITE_SUPABASE_ANON_KEY?: string
}

export const env: AppEnv = {
  VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
  VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY,
}

function required(value: string | undefined, name: string): string {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new Error(`Variável de ambiente ausente: ${name}`)
  }
  return value
}

export function getSupabaseEnv() {
  return {
    url: required(env.VITE_SUPABASE_URL, 'VITE_SUPABASE_URL'),
    anonKey: required(env.VITE_SUPABASE_ANON_KEY, 'VITE_SUPABASE_ANON_KEY'),
  }
}

