import { normalizeSearchString } from '../utils/normalizeSearchString'

/**
 * Regra especial: listagem por unidade (sem agrupar por marca) em Empresas.
 * Preferir `VITE_CLINICAS_ODONTOLOGICAS_CATEGORY_ID` (UUID no Supabase); senão detecta pelo nome.
 */
const CLINICAS_ODONTOLOGICAS_NOME_REF = 'clínicas odontológicas'

const CLINICAS_ODONTOLOGICAS_CATEGORY_ID =
  typeof import.meta.env.VITE_CLINICAS_ODONTOLOGICAS_CATEGORY_ID === 'string'
    ? import.meta.env.VITE_CLINICAS_ODONTOLOGICAS_CATEGORY_ID.trim()
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
