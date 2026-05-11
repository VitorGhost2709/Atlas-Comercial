import { normalizeSearchString } from '../utils/normalizeSearchString'

/**
 * Regra especial: listagem por unidade (sem agrupar por marca) em Empresas.
 * Preferir `VITE_CLINICAS_ODONTOLOGICAS_CATEGORY_ID` (UUID no Supabase); senão detecta pelo nome.
 */
const CLINICAS_ODONTOLOGICAS_NOME_REF = 'clínicas odontológicas'

const DEPOSITO_BEBIDAS_NOME_REFS = ['depósito de bebidas', 'distribuidora de bebidas'] as const
const PADARIA_NOME_REFS = ['padaria', 'padarias'] as const

/** IDs conhecidos no banco (fallback quando o nome não bate ou RLS limita leitura). */
const DEPOSITO_BEBIDAS_KNOWN_IDS = ['2cddc776-cdff-4233-b785-ce600f03b77f'] as const
const PADARIA_KNOWN_ID = 'e2b6a8ab-917c-4848-9323-4e25eeab2824'

const HYBRID_KNOWN_IDS: readonly string[] = [...DEPOSITO_BEBIDAS_KNOWN_IDS, PADARIA_KNOWN_ID]

const CLINICAS_ODONTOLOGICAS_CATEGORY_ID =
  typeof import.meta.env.VITE_CLINICAS_ODONTOLOGICAS_CATEGORY_ID === 'string'
    ? import.meta.env.VITE_CLINICAS_ODONTOLOGICAS_CATEGORY_ID.trim()
    : ''

const DEPOSITO_BEBIDAS_CATEGORY_ID =
  typeof import.meta.env.VITE_DEPOSITO_BEBIDAS_CATEGORY_ID === 'string'
    ? import.meta.env.VITE_DEPOSITO_BEBIDAS_CATEGORY_ID.trim()
    : ''

const PADARIA_CATEGORY_ID =
  typeof import.meta.env.VITE_PADARIA_CATEGORY_ID === 'string'
    ? import.meta.env.VITE_PADARIA_CATEGORY_ID.trim()
    : ''

export function isClinicasOdontologicasCategory(
  categoryId: string,
  categoryNome: string | null | undefined,
): boolean {
  const id = categoryId.trim()
  if (!id) return false
  if (CLINICAS_ODONTOLOGICAS_CATEGORY_ID && id === CLINICAS_ODONTOLOGICAS_CATEGORY_ID) return true
  if (!categoryNome?.trim()) return false
  return (
    normalizeSearchString(categoryNome) === normalizeSearchString(CLINICAS_ODONTOLOGICAS_NOME_REF)
  )
}

/**
 * Listagem híbrida na tela Empresas: marcas agrupadas + lojas avulsas (`empresa_id` nulo).
 *
 * Inclui:
 * - Depósito / distribuidora de bebidas (ID conhecido, env ou nome).
 * - Padaria (ID obrigatório no catálogo + env opcional ou nome padaria/padarias).
 */
export function isHybridEmpresasListingCategory(
  categoryId: string,
  categoryNome: string | null | undefined,
): boolean {
  const id = categoryId.trim()
  if (!id) return false

  if (DEPOSITO_BEBIDAS_CATEGORY_ID && id === DEPOSITO_BEBIDAS_CATEGORY_ID) return true
  if (PADARIA_CATEGORY_ID && id === PADARIA_CATEGORY_ID) return true
  if (HYBRID_KNOWN_IDS.includes(id)) return true

  if (!categoryNome?.trim()) return false
  const nn = normalizeSearchString(categoryNome)
  if (DEPOSITO_BEBIDAS_NOME_REFS.some((ref) => nn === normalizeSearchString(ref))) return true
  if (PADARIA_NOME_REFS.some((ref) => nn === normalizeSearchString(ref))) return true
  return false
}
