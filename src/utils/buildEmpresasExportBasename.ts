import { slugifyForFilename } from './slugifyForFilename'

export function buildEmpresasExportBasename(cidadeNome: string, categoriaNome: string): string {
  return `empresas-${slugifyForFilename(cidadeNome)}-${slugifyForFilename(categoriaNome)}`
}
