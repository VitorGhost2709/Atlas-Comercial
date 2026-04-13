import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { ROUTES } from '../routes/paths'

function canGoBack(pathname: string) {
  return pathname !== '/'
}

function contentMaxClass(pathname: string) {
  if (pathname === '/') return 'max-w-5xl'
  if (pathname.endsWith('/empresas')) return 'max-w-6xl'
  return 'max-w-3xl'
}

export function AppShell() {
  const navigate = useNavigate()
  const location = useLocation()
  const maxW = contentMaxClass(location.pathname)

  return (
    <div className="min-h-dvh bg-[#0c111f] text-zinc-100">
      <header className="border-b border-white/10 bg-[#0c111f]/80 backdrop-blur">
        <div className={`mx-auto flex ${maxW} items-center gap-3 px-4 py-3`}>
          {canGoBack(location.pathname) ? (
            <button
              type="button"
              className="rounded-lg border border-white/15 bg-white/5 px-3 py-1 text-sm text-zinc-100 hover:bg-white/10"
              onClick={() => navigate(-1)}
            >
              Voltar
            </button>
          ) : (
            <Link
              to={ROUTES.states()}
              className="text-sm font-semibold tracking-tight text-zinc-100 transition hover:text-white"
            >
              Atlas Comercial
            </Link>
          )}

          <nav className="ml-auto flex items-center gap-3 text-sm">
            <Link className="text-zinc-200 hover:text-white" to={ROUTES.states()}>
              Estados
            </Link>
            <Link className="text-zinc-200 hover:text-white" to={ROUTES.search()}>
              Buscar
            </Link>
          </nav>
        </div>
      </header>

      <main className={`mx-auto ${maxW} px-4 py-8`}>
        <Outlet />
      </main>
    </div>
  )
}

