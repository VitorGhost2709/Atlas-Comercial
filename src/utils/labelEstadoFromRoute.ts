/** Rótulo amigável do estado a partir do segmento da URL (ex.: `mg` → Minas Gerais). */
export function labelEstadoFromRoute(stateId: string | undefined): string {
  const s = (stateId ?? '').trim().toLowerCase()
  if (s === 'mg') return 'Minas Gerais'
  const raw = (stateId ?? '').trim()
  return raw || '—'
}
