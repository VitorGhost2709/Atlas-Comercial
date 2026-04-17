export type StateId = string
export type RegionId = string
export type CityId = string
export type CategoryId = string
export type CompanyId = string

export type RegionsRouteParams = {
  stateId: StateId
}

export type CitiesRouteParams = {
  stateId: StateId
  regionId: RegionId
}

export type CityRouteParams = {
  stateId: StateId
  regionId: RegionId
  cityId: CityId
}

export type CategoriesRouteParams = {
  stateId: StateId
  regionId: RegionId
  cityId: CityId
}

export type CompaniesRouteParams = {
  stateId: StateId
  regionId: RegionId
  cityId: CityId
  categoryId: CategoryId
}

export type StoresRouteParams = {
  stateId: StateId
  regionId: RegionId
  cityId: CityId
  categoryId: CategoryId
  companyId: CompanyId
}
