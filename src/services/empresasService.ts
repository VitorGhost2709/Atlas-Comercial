import { isClinicasOdontologicasCategory } from '../config/specialCategoryRules'
import { getSupabaseClient } from '../lib/supabaseClient'
import type { Database } from '../types/db'
import { unwrapList, unwrapSingle } from './supabaseResult'
import { fetchLojasFlatByCityAndCategoryForClinics, type ClinicLojaListRow } from './lojasService'

type Tables = Database['public']['Tables']

export type EmpresaListRow = Pick<
  Tables['empresas']['Row'],
  | 'id'
  | 'nome'
>

export type EmpresaRow = Tables['empresas']['Row']

export type CompanyGroup = {
  /** id da empresa/marca (para navegação até /stores) */
  id: string
  /** nome da empresa/marca (exibição) */
  nome_empresa: string
  /** quantidade de lojas/unidades no contexto atual */
  total_lojas: number
}

/** Resultado da tela Empresas: agrupado por marca ou lista plana (clínicas). */
export type EmpresasListingResult =
  | { variant: 'grouped'; rows: CompanyGroup[] }
  | { variant: 'clinics'; rows: ClinicLojaListRow[] }

type LojaEmpresaJoinRow = {
  empresa_id: string
  empresa: Pick<Tables['empresas']['Row'], 'id' | 'nome'> | null
}

export async function fetchEmpresasByCityAndCategory(
  cityId: string,
  categoryId: string,
): Promise<CompanyGroup[]> {
  const c = cityId.trim()
  const cat = categoryId.trim()
  if (!c || !cat) return []

  const supabase = getSupabaseClient()
  const result = await supabase
    .from('lojas')
    .select('empresa_id,empresa:empresas(id,nome)')
    .eq('cidade_id', c)
    .eq('categoria_id', cat)

  // Agrupamento feito no service (não no componente) para manter o frontend “burro”.
  // Idealmente isso vira uma view/RPC no banco quando necessário.
  const rows = unwrapList<LojaEmpresaJoinRow>(result)
  const counts = new Map<string, CompanyGroup>()
  for (const r of rows) {
    const emp = r.empresa
    if (!emp?.id) continue
    const prev = counts.get(emp.id)
    if (!prev) {
      counts.set(emp.id, { id: emp.id, nome_empresa: emp.nome ?? '', total_lojas: 1 })
      continue
    }
    prev.total_lojas += 1
  }

  return Array.from(counts.values())
    .filter((x) => x.nome_empresa.trim().length > 0)
    .sort((a, b) => {
      if (b.total_lojas !== a.total_lojas) return b.total_lojas - a.total_lojas
      return a.nome_empresa.localeCompare(b.nome_empresa, 'pt-BR', { sensitivity: 'base' })
    })
}

/**
 * Dados da página Empresas: por padrão agrupa por marca; para clínicas odontológicas lista cada loja.
 */
export async function fetchEmpresasListingForCompaniesPage(
  cityId: string,
  categoryId: string,
  categoryNome: string | null | undefined,
): Promise<EmpresasListingResult> {
  const c = cityId.trim()
  const cat = categoryId.trim()
  if (!c || !cat) return { variant: 'grouped', rows: [] }

  if (isClinicasOdontologicasCategory(cat, categoryNome)) {
    return {
      variant: 'clinics',
      rows: await fetchLojasFlatByCityAndCategoryForClinics(c, cat),
    }
  }

  return { variant: 'grouped', rows: await fetchEmpresasByCityAndCategory(c, cat) }
}

export async function fetchEmpresaById(companyId: string): Promise<EmpresaRow | null> {
  const id = companyId.trim()
  if (!id) return null

  const supabase = getSupabaseClient()
  const result = await supabase.from('empresas').select('*').eq('id', id).maybeSingle()
  return unwrapSingle<EmpresaRow>(result)
}

