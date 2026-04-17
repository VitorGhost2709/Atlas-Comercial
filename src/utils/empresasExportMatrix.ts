import type { LojaListRow } from '../services/lojasService'

export const EMPRESAS_EXPORT_HEADERS = ['Loja', 'Telefone', 'WhatsApp', 'Endereço'] as const

export function companiesToExportBodyMatrix(rows: LojaListRow[]): string[][] {
  return rows.map((r) => [
    r.nome_estabelecimento?.trim() ?? '',
    r.telefone_principal?.trim() ?? '',
    r.whatsapp?.trim() ?? '',
    r.endereco?.trim() ?? '',
  ])
}
