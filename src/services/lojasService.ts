import { getSupabaseClient } from '../lib/supabaseClient'
import type { Database } from '../types/db'
import { unwrapList, unwrapSingle } from './supabaseResult'

type Tables = Database['public']['Tables']

export type LojaListRow = Pick<
  Tables['lojas']['Row'],
  'id' | 'empresa_id' | 'nome_estabelecimento' | 'telefone_principal' | 'whatsapp' | 'endereco'
>

/** Linha para listagem “por unidade” (ex.: clínicas odontológicas na tela de Empresas). */
export type ClinicLojaListRow = Pick<
  Tables['lojas']['Row'],
  | 'id'
  | 'empresa_id'
  | 'nome_estabelecimento'
  | 'nome_responsavel_compras'
  | 'telefone_principal'
  | 'whatsapp'
  | 'endereco'
>

export type LojaRow = Tables['lojas']['Row']

export async function fetchLojasByEmpresaCityAndCategory(
  empresaId: string,
  cityId: string,
  categoryId: string,
): Promise<LojaListRow[]> {
  const e = empresaId.trim()
  const c = cityId.trim()
  const cat = categoryId.trim()
  if (!e || !c || !cat) return []

  const supabase = getSupabaseClient()
  const result = await supabase
    .from('lojas')
    .select('id,empresa_id,nome_estabelecimento,telefone_principal,whatsapp,endereco')
    .eq('empresa_id', e)
    .eq('cidade_id', c)
    .eq('categoria_id', cat)
    .order('nome_estabelecimento', { ascending: true })

  return unwrapList<LojaListRow>(result)
}

/**
 * Todas as lojas da cidade/categoria (sem agrupar), para listagem tipo “empresas_clientes”.
 * Filtra `aparece_no_site = true` quando a coluna existir no banco.
 */
export async function fetchLojasFlatByCityAndCategoryForClinics(
  cityId: string,
  categoryId: string,
): Promise<ClinicLojaListRow[]> {
  const c = cityId.trim()
  const cat = categoryId.trim()
  if (!c || !cat) return []

  const supabase = getSupabaseClient()
  const result = await supabase
    .from('lojas')
    .select(
      'id,empresa_id,nome_estabelecimento,nome_responsavel_compras,telefone_principal,whatsapp,endereco',
    )
    .eq('cidade_id', c)
    .eq('categoria_id', cat)
    .eq('aparece_no_site', true)
    .order('nome_estabelecimento', { ascending: true })

  return unwrapList<ClinicLojaListRow>(result)
}

export async function fetchLojaById(storeId: string): Promise<LojaRow | null> {
  const id = storeId.trim()
  if (!id) return null

  const supabase = getSupabaseClient()
  const result = await supabase.from('lojas').select('*').eq('id', id).maybeSingle()
  return unwrapSingle<LojaRow>(result)
}

