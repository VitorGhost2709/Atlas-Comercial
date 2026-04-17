import { fetchEmpresasByCityAndCategory } from '../services/empresasService'
import { useAsync } from './useAsync'

export function useEmpresasByCityAndCategory(cityId: string | null, categoryId: string | null) {
  return useAsync(
    () => {
      if (cityId == null || categoryId == null) return Promise.resolve([])
      const c = cityId.trim()
      const cat = categoryId.trim()
      if (!c || !cat) return Promise.resolve([])
      return fetchEmpresasByCityAndCategory(c, cat)
    },
    [cityId, categoryId],
  )
}

