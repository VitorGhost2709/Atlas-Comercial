import { fetchCompaniesByCityAndCategory } from '../services/companiesService'
import { useAsync } from './useAsync'

export function useCompaniesByCityAndCategory(
  cityId: string | null,
  categoryId: string | null,
) {
  return useAsync(
    () => {
      if (cityId == null || categoryId == null) return Promise.resolve([])
      const c = cityId.trim()
      const cat = categoryId.trim()
      if (!c || !cat) return Promise.resolve([])
      return fetchCompaniesByCityAndCategory(c, cat)
    },
    [cityId, categoryId],
  )
}
