export function extractNeighborhood(address: string | null | undefined): string | null {
  const normalized = address?.replace(/\s+/g, ' ').trim()
  if (!normalized) return null

  const withoutCity = normalized.replace(/,\s*[^,]+?\s*-\s*[A-Z]{2}\s*$/i, '').trim()

  const rawCandidates = [
    withoutCity.split(/\s+-\s+/).at(-1) ?? '',
    withoutCity.split(',').at(-1) ?? '',
  ]

  for (const rawCandidate of rawCandidates) {
    const candidate = rawCandidate
      .replace(/^(bairro\s+)/i, '')
      .replace(/\b(?:shopping|shop|box|loja)\b.*$/i, '')
      .replace(/^[,\-\s]+|[,\-\s]+$/g, '')
      .trim()

    if (!candidate) continue
    if (/^(av\.?|avenida|rua|r\.|al\.?|alameda|rodovia)\b/i.test(candidate)) continue
    if (!/[A-Za-zÀ-ÿ]/.test(candidate)) continue

    return candidate
  }

  return null
}
