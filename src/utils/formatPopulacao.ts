const numberFormatter = new Intl.NumberFormat('pt-BR', {
  maximumFractionDigits: 0,
  useGrouping: true,
})

/**
 * Texto para UI: habitantes com separador de milhar pt-BR.
 * `null` / `undefined` / `NaN` → "—" (discreto).
 */
export function formatPopulacaoExibicao(populacao: number | null | undefined): string {
  if (populacao == null || Number.isNaN(Number(populacao))) {
    return '—'
  }
  const n = Math.round(Number(populacao))
  return `${numberFormatter.format(n)} hab.`
}
