import { fetchCategoryById } from '../services/categoriesService'
import { fetchCityWithRegionById } from '../services/citiesService'
import { fetchEmpresaById } from '../services/empresasService'
import { useAsync } from './useAsync'

export type LojasCatalogLabels = {
  cidadeNome: string
  regiaoNome: string | null
  categoriaNome: string
  empresaNome: string
}

export function useLojasCatalogLabels(
  cityId: string | null,
  categoryId: string | null,
  companyId: string | null,
) {
  return useAsync(async (): Promise<LojasCatalogLabels | null> => {
    const c = cityId?.trim()
    const cat = categoryId?.trim()
    const emp = companyId?.trim()
    if (!c || !cat || !emp) return null

    const [cityRow, categoryRow, companyRow] = await Promise.all([
      fetchCityWithRegionById(c),
      fetchCategoryById(cat),
      fetchEmpresaById(emp),
    ])
    if (!cityRow || !categoryRow || !companyRow) return null

    return {
      cidadeNome: cityRow.nome,
      regiaoNome: cityRow.regiao?.nome ?? null,
      categoriaNome: categoryRow.nome,
      empresaNome: companyRow.nome,
    }
  }, [cityId, categoryId, companyId])
}

