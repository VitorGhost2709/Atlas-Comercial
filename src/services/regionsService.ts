import { getSupabaseClient } from '../lib/supabaseClient'
import type { Database } from '../types/db'
import { unwrapList } from './supabaseResult'

type Tables = Database['public']['Tables']

export type RegionRow = Pick<Tables['regioes_minas']['Row'], 'id' | 'nome'>

/**
 * Lista todas as regiões de Minas (tabela `regioes_minas`), ordenadas por nome.
 * Em falha de rede/RLS/etc., lança o `PostgrestError` retornado pelo Supabase.
 */
export async function fetchAllRegions(): Promise<RegionRow[]> {
  const supabase = getSupabaseClient()
  const result = await supabase
    .from('regioes_minas')
    .select('id,nome')
    .order('nome', { ascending: true })

  return unwrapList<RegionRow>(result)
}
