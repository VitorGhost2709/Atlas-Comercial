import { fetchCategoryById } from '../services/categoriesService'
import { fetchCityWithRegionById } from '../services/citiesService'
import { useAsync } from './useAsync'

export type EmpresasCatalogLabels = {
  cidadeNome: string
  regiaoNome: string | null
  categoriaNome: string
}

export function useEmpresasCatalogLabels(cityId: string | null, categoryId: string | null) {
  return useAsync(async (): Promise<EmpresasCatalogLabels | null> => {
    const c = cityId?.trim()
    const cat = categoryId?.trim()
    if (!c || !cat) return null

    const [cityRow, categoryRow] = await Promise.all([
      fetchCityWithRegionById(c),
      fetchCategoryById(cat),
    ])
    if (!cityRow || !categoryRow) return null

    return {
      cidadeNome: cityRow.nome,
      regiaoNome: cityRow.regiao?.nome ?? null,
      categoriaNome: categoryRow.nome,
    }
  }, [cityId, categoryId])
}
