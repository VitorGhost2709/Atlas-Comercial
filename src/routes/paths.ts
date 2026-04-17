import type { CategoryId, CityId, CompanyId, RegionId, StateId } from './routeTypes'

export const ROUTES = {
  states: () => `/`,
  regions: (stateId: StateId) => `/states/${encodeURIComponent(stateId)}/regions`,
  cities: (stateId: StateId, regionId: RegionId) =>
    `/states/${encodeURIComponent(stateId)}/regions/${encodeURIComponent(regionId)}/cities`,
  city: (stateId: StateId, regionId: RegionId, cityId: CityId) =>
    `/states/${encodeURIComponent(stateId)}/regions/${encodeURIComponent(regionId)}/cities/${encodeURIComponent(cityId)}`,
  categories: (stateId: StateId, regionId: RegionId, cityId: CityId) =>
    `/states/${encodeURIComponent(stateId)}/regions/${encodeURIComponent(regionId)}/cities/${encodeURIComponent(cityId)}/categories`,
  companies: (
    stateId: StateId,
    regionId: RegionId,
    cityId: CityId,
    categoryId: CategoryId,
  ) =>
    `/states/${encodeURIComponent(stateId)}/regions/${encodeURIComponent(regionId)}/cities/${encodeURIComponent(cityId)}/categories/${encodeURIComponent(categoryId)}/companies`,
  stores: (
    stateId: StateId,
    regionId: RegionId,
    cityId: CityId,
    categoryId: CategoryId,
    companyId: CompanyId,
  ) =>
    `/states/${encodeURIComponent(stateId)}/regions/${encodeURIComponent(regionId)}/cities/${encodeURIComponent(cityId)}/categories/${encodeURIComponent(categoryId)}/companies/${encodeURIComponent(companyId)}/stores`,
  search: () => `/search`,
} as const

