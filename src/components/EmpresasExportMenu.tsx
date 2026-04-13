import { Download, FileSpreadsheet, FileText } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import type { CompanyListRow } from '../services/companiesService'
import type { EmpresasPdfContext } from '../utils/exportEmpresasPdf'

type Props = {
  rows: CompanyListRow[]
  disabled: boolean
  disabledTitle?: string
  basename: string
  pdfContext: EmpresasPdfContext | null
}

export function EmpresasExportMenu({
  rows,
  disabled,
  disabledTitle,
  basename,
  pdfContext,
}: Props) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  const runExcel = () => {
    setOpen(false)
    void import('../utils/exportEmpresasXlsx')
      .then(({ exportEmpresasXlsx }) =>
        exportEmpresasXlsx(rows, `${basename}.xlsx`, pdfContext).catch((err: unknown) => {
          console.error('[cidadesMG] Falha ao gerar Excel:', err)
        }),
      )
      .catch((err: unknown) => {
        console.error('[cidadesMG] Falha ao carregar módulo de export Excel:', err)
      })
  }

  const runPdf = () => {
    setOpen(false)
    void import('../utils/exportEmpresasPdf').then(({ exportEmpresasPdf }) => {
      exportEmpresasPdf(rows, `${basename}.pdf`, pdfContext)
    })
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        disabled={disabled}
        title={disabled ? disabledTitle : 'Exportar lista atual'}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label="Exportar lista"
        onClick={() => {
          if (!disabled) setOpen((o) => !o)
        }}
        className={`inline-flex shrink-0 items-center justify-center rounded-lg border p-1.5 transition ${
          open
            ? 'border-[#ed9e6f]/55 bg-[#512f5c]/40 text-[#ed9e6f]'
            : 'border-white/15 bg-white/5 text-zinc-100 hover:border-[#b66570]/40 hover:bg-[#2d1f44]/60'
        } disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-white/15 disabled:hover:bg-white/5`}
      >
        <Download className="h-6 w-6 shrink-0" strokeWidth={2} aria-hidden />
      </button>

      {open ? (
        <ul
          role="menu"
          aria-label="Formato de exportação"
          className="absolute right-0 top-full z-50 mt-1.5 min-w-[10.5rem] overflow-hidden rounded-xl border border-white/12 bg-[#0c111f]/98 py-1 shadow-[0_16px_48px_rgba(0,0,0,0.55)] backdrop-blur-md"
        >
          <li role="presentation">
            <button
              type="button"
              role="menuitem"
              onClick={runExcel}
              className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm text-zinc-200 transition hover:bg-[#512f5c]/45 hover:text-white"
            >
              <FileSpreadsheet className="h-4 w-4 shrink-0 text-[#ed9e6f]" aria-hidden />
              Excel
            </button>
          </li>
          <li role="presentation">
            <button
              type="button"
              role="menuitem"
              onClick={runPdf}
              className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm text-zinc-200 transition hover:bg-[#512f5c]/45 hover:text-white"
            >
              <FileText className="h-4 w-4 shrink-0 text-[#b66570]" aria-hidden />
              PDF
            </button>
          </li>
        </ul>
      ) : null}
    </div>
  )
}
