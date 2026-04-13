import { Link, useParams } from 'react-router-dom'
import { ReloadIconButton } from '../components/ReloadIconButton'
import { useAllCategories } from '../hooks/useAllCategories'
import type { CategoriesRouteParams } from '../routes/routeTypes'
import { ROUTES } from '../routes/paths'

export function CategoriesPage() {
  const { stateId, regionId, cityId } = useParams<CategoriesRouteParams>()
  const effectiveStateId = stateId ?? 'mg'
  const { data: categorias, loading, error, reload } = useAllCategories()

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-white">Categorias</h1>
        <p className="text-sm leading-relaxed text-zinc-300">
          Catálogo de categorias do sistema. Escolha uma para ver as empresas desta cidade na
          próxima etapa.
        </p>
      </header>

      <div className="rounded-2xl border border-white/10 bg-[#2d1f44]/35 shadow-[0_20px_60px_rgba(0,0,0,0.45)] backdrop-blur">
        <div className="flex items-center justify-between gap-3 border-b border-white/10 px-5 py-4">
          <div className="text-sm font-medium text-zinc-100">Todas as categorias</div>
          <ReloadIconButton onClick={reload} />
        </div>

        <div className="p-2 sm:p-3">
          {loading ? (
            <div className="space-y-2 p-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  // eslint-disable-next-line react/no-array-index-key
                  key={i}
                  className="h-11 w-full rounded-xl border border-white/10 bg-white/5"
                />
              ))}
            </div>
          ) : error ? (
            <div className="space-y-3 p-4">
              <div className="text-sm font-medium text-white">Não foi possível carregar.</div>
              <p className="text-sm text-zinc-300">
                Verifique conexão e políticas RLS na tabela{' '}
                <span className="font-mono text-xs">categorias</span>.
              </p>
              <button
                type="button"
                onClick={reload}
                className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm text-white hover:bg-white/10"
              >
                Tentar novamente
              </button>
            </div>
          ) : (categorias ?? []).length === 0 ? (
            <div className="p-4">
              <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-zinc-300">
                Nenhuma categoria cadastrada no banco.
              </div>
            </div>
          ) : (
            <ul className="grid gap-2 p-2 sm:p-3">
              {(categorias ?? []).map((cat) => (
                <li key={cat.id}>
                  <Link
                    to={ROUTES.empresas(
                      effectiveStateId,
                      regionId ?? '',
                      cityId ?? '',
                      cat.id,
                    )}
                    className="block rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none transition hover:border-[#b66570]/35 hover:bg-white/[0.07] focus-visible:ring-2 focus-visible:ring-[#ed9e6f]/30 active:scale-[0.99]"
                  >
                    <span className="text-sm font-medium text-zinc-100">{cat.nome}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  )
}
