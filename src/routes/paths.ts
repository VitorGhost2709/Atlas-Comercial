import type { CategoryId, CityId, RegionId, StateId } from './routeTypes'

export const ROUTES = {
  states: () => `/`,
  regions: (stateId: StateId) => `/states/${encodeURIComponent(stateId)}/regions`,
  cities: (stateId: StateId, regionId: RegionId) =>
    `/states/${encodeURIComponent(stateId)}/regions/${encodeURIComponent(regionId)}/cities`,
  city: (stateId: StateId, regionId: RegionId, cityId: CityId) =>
    `/states/${encodeURIComponent(stateId)}/regions/${encodeURIComponent(regionId)}/cities/${encodeURIComponent(cityId)}`,
  categories: (stateId: StateId, regionId: RegionId, cityId: CityId) =>
    `/states/${encodeURIComponent(stateId)}/regions/${encodeURIComponent(regionId)}/cities/${encodeURIComponent(cityId)}/categories`,
  empresas: (
    stateId: StateId,
    regionId: RegionId,
    cityId: CityId,
    categoryId: CategoryId,
  ) =>
    `/states/${encodeURIComponent(stateId)}/regions/${encodeURIComponent(regionId)}/cities/${encodeURIComponent(cityId)}/categories/${encodeURIComponent(categoryId)}/empresas`,
  search: () => `/search`,
} as const

