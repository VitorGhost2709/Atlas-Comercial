import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import type { CompanyListRow } from '../services/companiesService'
import { companiesToExportBodyMatrix, EMPRESAS_EXPORT_HEADERS } from './empresasExportMatrix'
import { downloadBlob } from './downloadBlob'

export type EmpresasPdfContext = {
  estado: string
  regiao: string | null
  cidade: string
  categoria: string
}

export function exportEmpresasPdf(
  rows: CompanyListRow[],
  filename: string,
  context: EmpresasPdfContext | null,
): void {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' })
  const margin = 14
  let y = margin

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(16)
  doc.setTextColor(44, 31, 68)
  doc.text('Empresas exportadas', margin, y)
  y += 8

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.setTextColor(60, 60, 60)

  if (context) {
    const lines: string[] = [
      `Estado: ${context.estado}`,
      context.regiao ? `Região: ${context.regiao}` : null,
      `Cidade: ${context.cidade}`,
      `Categoria: ${context.categoria}`,
    ].filter((l): l is string => l != null)

    lines.forEach((line) => {
      doc.text(line, margin, y)
      y += 5
    })
    y += 4
  } else {
    y += 4
  }

  const head = [[...EMPRESAS_EXPORT_HEADERS]]
  const body = companiesToExportBodyMatrix(rows)

  autoTable(doc, {
    startY: y,
    head,
    body,
    styles: { fontSize: 8, cellPadding: 2, textColor: [40, 40, 40] },
    headStyles: {
      fillColor: [81, 47, 92],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
    },
    alternateRowStyles: { fillColor: [248, 246, 250] },
    theme: 'striped',
    margin: { left: margin, right: margin },
    tableLineColor: [200, 200, 200],
    tableLineWidth: 0.1,
  })

  downloadBlob(doc.output('blob'), filename)
}
