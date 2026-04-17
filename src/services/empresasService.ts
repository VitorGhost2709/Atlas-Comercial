import { getSupabaseClient } from '../lib/supabaseClient'
import type { Database } from '../types/db'
import { unwrapList, unwrapSingle } from './supabaseResult'

type Tables = Database['public']['Tables']

export type EmpresaListRow = Pick<
  Tables['empresas']['Row'],
  | 'id'
  | 'nome'
  | 'nome_responsavel_compras'
  | 'telefone_principal'
  | 'whatsapp'
  | 'status_validacao'
>

export type EmpresaRow = Tables['empresas']['Row']

type LojaEmpresaJoinRow = {
  empresa: EmpresaListRow | null
}

export async function fetchEmpresasByCityAndCategory(
  cityId: string,
  categoryId: string,
): Promise<EmpresaListRow[]> {
  const c = cityId.trim()
  const cat = categoryId.trim()
  if (!c || !cat) return []

  const supabase = getSupabaseClient()
  const result = await supabase
    .from('lojas')
    .select(
      'empresa:empresas(id,nome,nome_responsavel_compras,telefone_principal,whatsapp,status_validacao)',
    )
    .eq('cidade_id', c)
    .eq('categoria_id', cat)

  const rows = unwrapList<LojaEmpresaJoinRow>(result)
  const unique = new Map<string, EmpresaListRow>()
  for (const r of rows) {
    if (!r.empresa) continue
    unique.set(r.empresa.id, r.empresa)
  }

  return Array.from(unique.values()).sort((a, b) =>
    (a.nome ?? '').localeCompare(b.nome ?? '', 'pt-BR', { sensitivity: 'base' }),
  )
}

export async function fetchEmpresaById(companyId: string): Promise<EmpresaRow | null> {
  const id = companyId.trim()
  if (!id) return null

  const supabase = getSupabaseClient()
  const result = await supabase.from('empresas').select('*').eq('id', id).maybeSingle()
  return unwrapSingle<EmpresaRow>(result)
}

