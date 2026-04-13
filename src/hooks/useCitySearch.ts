import { searchCitiesByName } from '../services/citiesService'
import { useAsync } from './useAsync'

export function useCitySearch(query: string) {
  const q = query.trim()
  return useAsync(() => searchCitiesByName(q), [q])
}

