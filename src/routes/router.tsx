import { createBrowserRouter } from 'react-router-dom'
import { AppShell } from '../components/AppShell'
import { CategoriesPage } from '../pages/CategoriesPage'
import { CitiesPage } from '../pages/CitiesPage'
import { CompaniesPage } from '../pages/CompaniesPage'
import { RegionsPage } from '../pages/RegionsPage'
import { SearchPage } from '../pages/SearchPage'
import { StatesPage } from '../pages/StatesPage'
import { StoresPage } from '../pages/StoresPage'

export const router = createBrowserRouter([
  {
    element: <AppShell />,
    children: [
      { path: '/', element: <StatesPage /> },
      { path: '/states/:stateId/regions', element: <RegionsPage /> },
      {
        path: '/states/:stateId/regions/:regionId/cities',
        element: <CitiesPage />,
      },
      {
        path: '/states/:stateId/regions/:regionId/cities/:cityId/categories',
        element: <CategoriesPage />,
      },
      {
        path: '/states/:stateId/regions/:regionId/cities/:cityId/categories/:categoryId/empresas',
        element: <CompaniesPage />,
      },
      {
        path: '/states/:stateId/regions/:regionId/cities/:cityId/categories/:categoryId/companies',
        element: <CompaniesPage />,
      },
      {
        path: '/states/:stateId/regions/:regionId/cities/:cityId/categories/:categoryId/companies/:companyId/stores',
        element: <StoresPage />,
      },
      { path: '/search', element: <SearchPage /> },
    ],
  },
])

