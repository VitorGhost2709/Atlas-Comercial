import { fetchAllCategories } from '../services/categoriesService'
import { useAsync } from './useAsync'

export function useAllCategories() {
  return useAsync(() => fetchAllCategories(), [])
}
