import { getSupabaseClient } from '../lib/supabaseClient'
import type { Database } from '../types/db'
import { unwrapList, unwrapSingle } from './supabaseResult'

type Tables = Database['public']['Tables']

export type CategoryRow = Pick<Tables['categorias']['Row'], 'id' | 'nome'>

/**
 * Catálogo completo de categorias (`categorias`), ordenado por nome.
 * Não depende de cidade nem de `empresas_clientes`.
 */
export async function fetchAllCategories(): Promise<CategoryRow[]> {
  const supabase = getSupabaseClient()
  const result = await supabase
    .from('categorias')
    .select('id,nome')
    .order('nome', { ascending: true })

  // Catálogo dinâmico: qualquer linha em `categorias` (permitida por RLS) aparece na UI.
  // Ordenação explícita em pt-BR para nomes com acento/plural ficarem previsíveis na lista.
  const rows = unwrapList<CategoryRow>(result)
  return [...rows].sort((a, b) =>
    a.nome.localeCompare(b.nome, 'pt-BR', { sensitivity: 'base' }),
  )
}

/**
 * Uma categoria pelo `id` (UUID).
 */
export async function fetchCategoryById(categoryId: string): Promise<CategoryRow | null> {
  const id = categoryId.trim()
  if (!id) return null

  const supabase = getSupabaseClient()
  const result = await supabase
    .from('categorias')
    .select('id,nome')
    .eq('id', id)
    .maybeSingle()

  return unwrapSingle<CategoryRow>(result)
}
