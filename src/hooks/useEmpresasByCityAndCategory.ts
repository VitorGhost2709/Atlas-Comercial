import { fetchCategoryById } from '../services/categoriesService'
import { fetchEmpresasListingForCompaniesPage, type EmpresasListingResult } from '../services/empresasService'
import { useAsync } from './useAsync'

const EMPTY_GROUPED: EmpresasListingResult = { variant: 'grouped', rows: [] }

export function useEmpresasByCityAndCategory(cityId: string | null, categoryId: string | null) {
  return useAsync(async () => {
    if (cityId == null || categoryId == null) return EMPTY_GROUPED
    const c = cityId.trim()
    const cat = categoryId.trim()
    if (!c || !cat) return EMPTY_GROUPED

    const categoryRow = await fetchCategoryById(cat)
    return fetchEmpresasListingForCompaniesPage(c, cat, categoryRow?.nome)
  }, [cityId, categoryId])
}

