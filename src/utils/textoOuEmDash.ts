/** Texto para UI quando o valor do banco é nulo ou em branco. */
export function textoOuEmDash(value: string | null | undefined): string {
  const t = value?.trim()
  return t ? t : '—'
}
