/** Remove diacríticos e padroniza para comparação case-insensitive (pt-BR). */
export function normalizeSearchString(value: string): string {
  return value
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
}
