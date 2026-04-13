import { fetchCitiesByRegion } from '../services/citiesService'
import { useAsync } from './useAsync'

export function useCities(regionId: string | null) {
  return useAsync(
    () => (regionId == null ? Promise.resolve([]) : fetchCitiesByRegion(regionId)),
    [regionId],
  )
}

