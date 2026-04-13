import { getSupabaseClient } from '../lib/supabaseClient'
import type { Database } from '../types/db'
import { unwrapList } from './supabaseResult'

type Tables = Database['public']['Tables']

/** Campos exibidos na lista (nomes alinhados às colunas reais de `empresas_clientes`). */
export type CompanyListRow = Pick<
  Tables['empresas_clientes']['Row'],
  | 'id'
  | 'nome_estabelecimento'
  | 'nome_responsavel_compras'
  | 'telefone_principal'
  | 'whatsapp'
  | 'endereco'
>

/**
 * Empresas em `empresas_clientes` para a cidade e categoria informadas (UUIDs).
 */
export async function fetchCompaniesByCityAndCategory(
  cityId: string,
  categoryId: string,
): Promise<CompanyListRow[]> {
  const c = cityId.trim()
  const cat = categoryId.trim()
  if (!c || !cat) return []

  const supabase = getSupabaseClient()
  const result = await supabase
    .from('empresas_clientes')
    .select(
      'id,nome_estabelecimento,nome_responsavel_compras,telefone_principal,whatsapp,endereco',
    )
    .eq('cidade_id', c)
    .eq('categoria_id', cat)
    .order('nome_estabelecimento', { ascending: true })

  return unwrapList<CompanyListRow>(result)
}
