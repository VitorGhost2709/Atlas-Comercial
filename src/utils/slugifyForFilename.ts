/** Normaliza texto para uso seguro em nomes de arquivo (minúsculas, sem acentos, hífens). */
export function slugifyForFilename(input: string): string {
  const s = input
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)

  return s || 'dados'
}
