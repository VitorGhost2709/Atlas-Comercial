import { fetchAllRegions } from '../services/regionsService'
import { useAsync } from './useAsync'

export function useRegions() {
  return useAsync(() => fetchAllRegions(), [])
}

