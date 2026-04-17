import { slugifyForFilename } from './slugifyForFilename'

export function buildEmpresasExportBasename(cidadeNome: string, categoriaNome: string): string {
  return `empresas-${slugifyForFilename(cidadeNome)}-${slugifyForFilename(categoriaNome)}`
}

export function buildLojasExportBasename(cidadeNome: string, categoriaNome: string): string {
  return `lojas-${slugifyForFilename(cidadeNome)}-${slugifyForFilename(categoriaNome)}`
}
