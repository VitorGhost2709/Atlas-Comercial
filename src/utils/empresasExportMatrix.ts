import type { CompanyListRow } from '../services/companiesService'

export const EMPRESAS_EXPORT_HEADERS = [
  'Estabelecimento',
  'Comprador',
  'Telefone',
  'WhatsApp',
  'Endereço',
] as const

export function companiesToExportBodyMatrix(rows: CompanyListRow[]): string[][] {
  return rows.map((r) => [
    r.nome_estabelecimento?.trim() ?? '',
    r.nome_responsavel_compras?.trim() ?? '',
    r.telefone_principal?.trim() ?? '',
    r.whatsapp?.trim() ?? '',
    r.endereco?.trim() ?? '',
  ])
}
