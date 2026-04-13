import { getSupabaseClient } from '../lib/supabaseClient'
import type { Database } from '../types/db'
import { unwrapList, unwrapSingle } from './supabaseResult'

type Tables = Database['public']['Tables']

export type CityRow = Pick<Tables['cidades']['Row'], 'id' | 'nome' | 'regiao_id' | 'populacao'>

/** Linha de cidade com região embutida (join via PostgREST). */
export type CityWithRegion = CityRow & {
  regiao: Pick<Tables['regioes_minas']['Row'], 'id' | 'nome'> | null
}

/**
 * Resultado “pronto” para busca global: cidade + nome da região.
 * (Mantém `id` e `nome` da cidade; inclui apenas `regiao_nome`).
 */
export type CitySearchResult = {
  id: CityRow['id']
  nome: CityRow['nome']
  regiao_nome: Tables['regioes_minas']['Row']['nome'] | null
}

/**
 * Cidades de uma região (`regiao_id`). `regionId` vazio retorna lista vazia (sem round-trip).
 */
export async function fetchCitiesByRegion(regionId: string): Promise<CityRow[]> {
  const id = regionId.trim()
  if (!id) return []

  const supabase = getSupabaseClient()
  const result = await supabase
    .from('cidades')
    .select('id,nome,regiao_id,populacao')
    .eq('regiao_id', id)

  return unwrapList<CityRow>(result)
}

/**
 * Uma cidade pelo nome exato (após trim). Nome vazio → `null`.
 */
export async function fetchCityByExactName(nome: string): Promise<CityWithRegion | null> {
  const trimmed = nome.trim()
  if (!trimmed) return null

  const supabase = getSupabaseClient()
  const result = await supabase
    .from('cidades')
    .select('id,nome,regiao_id,populacao,regiao:regioes_minas(id,nome)')
    .eq('nome', trimmed)
    .maybeSingle()

  return unwrapSingle<CityWithRegion>(result)
}

/**
 * Uma cidade pelo `id` (UUID), com região embutida para exibição/exportação.
 */
export async function fetchCityWithRegionById(cityId: string): Promise<CityWithRegion | null> {
  const id = cityId.trim()
  if (!id) return null

  const supabase = getSupabaseClient()
  const result = await supabase
    .from('cidades')
    .select('id,nome,regiao_id,populacao,regiao:regioes_minas(id,nome)')
    .eq('id', id)
    .maybeSingle()

  return unwrapSingle<CityWithRegion>(result)
}

export type SearchCitiesOptions = {
  limit?: number
}

/**
 * Busca por trecho no nome (`ilike '%query%'`). Query vazia → `[]`.
 */
export async function searchCitiesByName(
  query: string,
  opts?: SearchCitiesOptions,
): Promise<CitySearchResult[]> {
  const q = query.trim()
  if (!q) return []

  const limit = opts?.limit ?? 30
  const supabase = getSupabaseClient()
  const result = await supabase
    .from('cidades')
    .select('id,nome,regiao:regioes_minas(nome)')
    .ilike('nome', `%${q}%`)
    .order('nome', { ascending: true })
    .limit(limit)

  const rows = unwrapList<{ id: string; nome: string; regiao: { nome: string } | null }>(result)
  return rows.map((r) => ({ id: r.id, nome: r.nome, regiao_nome: r.regiao?.nome ?? null }))
}
