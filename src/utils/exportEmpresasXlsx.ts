import type ExcelJSType from 'exceljs'
import type { CompanyListRow } from '../services/companiesService'
import { companiesToExportBodyMatrix, EMPRESAS_EXPORT_HEADERS } from './empresasExportMatrix'
import { downloadBlob } from './downloadBlob'
import type { EmpresasPdfContext } from './exportEmpresasPdf'
import { ensureExcelJsScript, getExcelJSFromWindow } from './loadExcelJsFromVendor'

const FILL_HEADER = 'FF512F5C'
const FILL_TITLE_TEXT = 'FF2D1F44'
const FILL_ZEBRA_A = 'FFF8F6FA'
const FILL_ZEBRA_B = 'FFFFFFFF'
const BORDER = 'FFE8E4ED'
const TEXT_BODY = 'FF2C2C2C'
const TEXT_CONTEXT = 'FF5C5665'

const COL_COUNT = 5

function thinBorder(): Partial<ExcelJSType.Borders> {
  const edge: ExcelJSType.Border = { style: 'thin', color: { argb: BORDER } }
  return { top: edge, left: edge, bottom: edge, right: edge }
}

/** Largura aproximada em “caracteres” do Excel (ajuste para texto longo / acentos). */
function textVisualWidth(s: string): number {
  let w = 0
  for (const ch of s) {
    const cp = ch.codePointAt(0) ?? 0
    w += cp > 0x00ff ? 1.15 : 1
  }
  return w
}

function computeColumnWidths(headerRow: string[], body: string[][]): number[] {
  const widths = new Array<number>(COL_COUNT).fill(0)
  const mins = [28, 18, 14, 14, 42]
  const maxs = [52, 36, 22, 22, 72]

  const consider = (col: number, text: string) => {
    const raw = textVisualWidth(text) + 2.8
    widths[col] = Math.max(widths[col], raw)
  }

  headerRow.forEach((h, i) => consider(i, h))
  body.forEach((row) => row.forEach((cell, i) => consider(i, cell)))

  return widths.map((w, i) => Math.min(maxs[i], Math.max(mins[i], w)))
}

export async function exportEmpresasXlsx(
  rows: CompanyListRow[],
  filename: string,
  context: EmpresasPdfContext | null,
): Promise<void> {
  await ensureExcelJsScript()
  const ExcelJS = getExcelJSFromWindow()
  const wb = new ExcelJS.Workbook()
  wb.creator = 'cidadesMG'
  wb.created = new Date()
  const ws = wb.addWorksheet('Empresas', {
    properties: { defaultRowHeight: 16 },
  })

  let headerRowNum: number
  let ySplit: number

  ws.mergeCells(1, 1, 1, COL_COUNT)
  const titleCell = ws.getRow(1).getCell(1)
  titleCell.value = 'EMPRESAS EXPORTADAS'
  titleCell.font = { name: 'Calibri', size: 18, bold: true, color: { argb: FILL_TITLE_TEXT } }
  titleCell.alignment = { vertical: 'middle', horizontal: 'center' }
  ws.getRow(1).height = 30

  if (context) {
    const lines = [
      `Estado: ${context.estado}`,
      `Região: ${context.regiao ?? '—'}`,
      `Cidade: ${context.cidade}`,
      `Categoria: ${context.categoria}`,
    ]
    for (let i = 0; i < lines.length; i++) {
      const r = 2 + i
      ws.mergeCells(r, 1, r, COL_COUNT)
      const c = ws.getRow(r).getCell(1)
      c.value = lines[i]
      c.font = { name: 'Calibri', size: 11, color: { argb: TEXT_CONTEXT } }
      c.alignment = { vertical: 'middle', horizontal: 'left', wrapText: false }
      ws.getRow(r).height = 18
    }
    ws.getRow(6).height = 10
    headerRowNum = 7
    ySplit = 7
  } else {
    ws.getRow(2).height = 12
    headerRowNum = 3
    ySplit = 3
  }

  const headers = [...EMPRESAS_EXPORT_HEADERS]
  const hRow = ws.getRow(headerRowNum)
  hRow.height = 24
  for (let col = 1; col <= COL_COUNT; col++) {
    const cell = hRow.getCell(col)
    cell.value = headers[col - 1]
    cell.font = { name: 'Calibri', size: 11, bold: true, color: { argb: 'FFFFFFFF' } }
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: FILL_HEADER } }
    cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true }
    cell.border = thinBorder()
  }

  const body = companiesToExportBodyMatrix(rows)
  const colWidths = computeColumnWidths(headers, body)

  body.forEach((dataRow, rowIdx) => {
    const excelRow = ws.getRow(headerRowNum + 1 + rowIdx)
    excelRow.height = 20
    const zebraFill = rowIdx % 2 === 0 ? FILL_ZEBRA_A : FILL_ZEBRA_B

    dataRow.forEach((raw, colIdx) => {
      const col = colIdx + 1
      const cell = excelRow.getCell(col)
      cell.value = raw
      cell.font = { name: 'Calibri', size: 10, color: { argb: TEXT_BODY } }
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: zebraFill } }
      cell.border = thinBorder()
      const isPhoneCol = col === 3 || col === 4
      cell.alignment = {
        vertical: 'middle',
        horizontal: isPhoneCol ? 'center' : 'left',
        wrapText: true,
      }
    })
  })

  colWidths.forEach((w, i) => {
    ws.getColumn(i + 1).width = w
  })

  ws.views = [
    {
      state: 'frozen',
      ySplit,
      xSplit: 0,
      topLeftCell: `A${headerRowNum + 1}`,
      activeCell: `A${headerRowNum + 1}`,
    },
  ]

  const raw = await wb.xlsx.writeBuffer()
  const bytes =
    raw instanceof Uint8Array
      ? raw
      : raw instanceof ArrayBuffer
        ? new Uint8Array(raw)
        : new Uint8Array(raw as ArrayBuffer)
  downloadBlob(
    new Blob([bytes], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }),
    filename,
  )
}
