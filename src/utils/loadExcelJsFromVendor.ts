import type ExcelJSDefault from 'exceljs'

const SCRIPT_ATTR = 'data-cidadesmg-exceljs'

/** Mesmo objeto que `import ExcelJS from 'exceljs'` (runtime vem do UMD em `public/vendor/`). */
export type ExcelJSGlobal = typeof ExcelJSDefault

let loadPromise: Promise<void> | null = null

/**
 * Carrega o bundle oficial browser do ExcelJS (`public/vendor/exceljs.min.js`),
 * evitando o pacote Node empacotado pelo Vite (que chama `require('fs')` e quebra no browser).
 */
export function ensureExcelJsScript(): Promise<void> {
  const w = window as unknown as { ExcelJS?: ExcelJSGlobal }
  if (w.ExcelJS) return Promise.resolve()
  if (loadPromise) return loadPromise

  loadPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[${SCRIPT_ATTR}]`)
    if (existing) {
      const finish = () => {
        if (!(window as unknown as { ExcelJS?: ExcelJSGlobal }).ExcelJS) {
          reject(new Error('ExcelJS não disponível após o script carregar.'))
        } else resolve()
      }
      if (existing.dataset.loaded === '1') {
        finish()
        return
      }
      existing.addEventListener('load', finish)
      existing.addEventListener('error', () =>
        reject(new Error('Falha ao carregar o script do ExcelJS.')),
      )
      return
    }

    const base = import.meta.env.BASE_URL
    const normalizedBase = base.endsWith('/') ? base : `${base}/`
    const src = `${normalizedBase}vendor/exceljs.min.js`

    const s = document.createElement('script')
    s.src = src
    s.async = true
    s.setAttribute(SCRIPT_ATTR, '1')
    s.onload = () => {
      s.dataset.loaded = '1'
      if (!(window as unknown as { ExcelJS?: ExcelJSGlobal }).ExcelJS) {
        reject(new Error('O script do ExcelJS carregou mas não definiu window.ExcelJS.'))
        return
      }
      resolve()
    }
    s.onerror = () =>
      reject(
        new Error(
          'Não foi possível baixar vendor/exceljs.min.js. Rode npm install ou node scripts/sync-exceljs-browser.mjs.',
        ),
      )
    document.head.appendChild(s)
  })

  return loadPromise
}

export function getExcelJSFromWindow(): ExcelJSGlobal {
  const ExcelJS = (window as unknown as { ExcelJS?: ExcelJSGlobal }).ExcelJS
  if (!ExcelJS) throw new Error('ExcelJS não foi carregado.')
  return ExcelJS
}
