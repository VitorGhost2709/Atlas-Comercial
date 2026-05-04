import { normalizeSearchString } from '../utils/normalizeSearchString'

/**
 * Regra especial: listagem por unidade (sem agrupar por marca) em Empresas.
 * Preferir `VITE_CLINICAS_ODONTOLOGICAS_CATEGORY_ID` (UUID no Supabase); senão detecta pelo nome.
 */
const CLINICAS_ODONTOLOGICAS_NOME_REF = 'clínicas odontológicas'
const DEPOSITO_BEBIDAS_NOME_REFS = ['depósito de bebidas', 'distribuidora de bebidas'] as const

// ID conhecido no banco do Atlas Comercial (fallback caso o nome não esteja legível por RLS).
const DEPOSITO_BEBIDAS_KNOWN_IDS = ['2cddc776-cdff-4233-b785-ce600f03b77f'] as const

const CLINICAS_ODONTOLOGICAS_CATEGORY_ID =
  typeof import.meta.env.VITE_CLINICAS_ODONTOLOGICAS_CATEGORY_ID === 'string'
    ? import.meta.env.VITE_CLINICAS_ODONTOLOGICAS_CATEGORY_ID.trim()
    : ''

const DEPOSITO_BEBIDAS_CATEGORY_ID =
  typeof import.meta.env.VITE_DEPOSITO_BEBIDAS_CATEGORY_ID === 'string'
    ? import.meta.env.VITE_DEPOSITO_BEBIDAS_CATEGORY_ID.trim()
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
 * Regra híbrida: empresas (agrupadas) + lojas avulsas (sem empresa_id).
 * Preferir `VITE_DEPOSITO_BEBIDAS_CATEGORY_ID`; senão detecta pelo nome.
 */
export function isDepositoBebidasCategory(
  categoryId: string,
  categoryNome: string | null | undefined,
): boolean {
  const id = categoryId.trim()
  if (!id) return false
  if (DEPOSITO_BEBIDAS_CATEGORY_ID && id === DEPOSITO_BEBIDAS_CATEGORY_ID) return true
  if ((DEPOSITO_BEBIDAS_KNOWN_IDS as readonly string[]).includes(id)) return true
  if (!categoryNome?.trim()) return false
  const nn = normalizeSearchString(categoryNome)
  return DEPOSITO_BEBIDAS_NOME_REFS.some((ref) => nn === normalizeSearchString(ref))
}
