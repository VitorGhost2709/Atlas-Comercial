import { fetchLojasByEmpresaCityAndCategory } from '../services/lojasService'
import { useAsync } from './useAsync'

export function useLojasByEmpresaCityAndCategory(
  empresaId: string | null,
  cityId: string | null,
  categoryId: string | null,
) {
  return useAsync(
    () => {
      if (empresaId == null || cityId == null || categoryId == null) return Promise.resolve([])
      const e = empresaId.trim()
      const c = cityId.trim()
      const cat = categoryId.trim()
      if (!e || !c || !cat) return Promise.resolve([])
      return fetchLojasByEmpresaCityAndCategory(e, c, cat)
    },
    [empresaId, cityId, categoryId],
  )
}

