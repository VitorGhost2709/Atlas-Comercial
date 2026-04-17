import { Link, useParams } from 'react-router-dom'
import { useRegions } from '../hooks/useRegions'
import type { RegionsRouteParams } from '../routes/routeTypes'
import { ROUTES } from '../routes/paths'

/** Primeira coluna (desktop); o restante vai na segunda — hoje 13 regiões no MG. */
const COL1_COUNT = 7
const COL2_COUNT = 13 - COL1_COUNT

function RegionItemLink({
  effectiveStateId,
  regiao,
}: {
  effectiveStateId: string
  regiao: { id: string; nome: string }
}) {
  return (
    <li>
      <Link
        to={ROUTES.cities(effectiveStateId, regiao.id)}
        className="block rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 transition hover:border-white/20 hover:bg-white/8 sm:px-4 sm:py-3"
      >
        <span className="text-sm font-medium text-zinc-100">{regiao.nome}</span>
      </Link>
    </li>
  )
}

export function RegionsPage() {
  const { stateId } = useParams<RegionsRouteParams>()
  const effectiveStateId = stateId ?? 'mg'
  const { data: regioes, loading, error, reload } = useRegions()
  const lista = regioes ?? []
  const col1 = lista.slice(0, COL1_COUNT)
  const col2 = lista.slice(COL1_COUNT)

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-white">
          Regiões de Minas Gerais
        </h1>
        <p className="text-sm leading-relaxed text-zinc-300">
          Escolha uma região para ver as cidades. Você também pode usar a busca global de
          cidades quando quiser.
        </p>
      </header>

      <div className="rounded-2xl border border-white/10 bg-[#2d1f44]/35 shadow-[0_20px_60px_rgba(0,0,0,0.45)] backdrop-blur">
        <div className="flex items-center justify-between gap-3 border-b border-white/10 px-5 py-4">
          <div className="text-sm font-medium text-zinc-100">Lista de regiões</div>
          <Link
            className="text-sm text-[#ed9e6f] hover:text-[#f2b088]"
            to={ROUTES.search()}
          >
            Ir para busca
          </Link>
        </div>

        <div className="p-2 sm:p-3">
          {loading ? (
            <div className="grid gap-3 md:grid-cols-2 md:gap-4">
              <div className="space-y-2">
                {Array.from({ length: COL1_COUNT }).map((_, i) => (
                  <div
                    key={i}
                    className="h-10 w-full rounded-xl border border-white/10 bg-white/5 sm:h-11"
                  />
                ))}
              </div>
              <div className="space-y-2">
                {Array.from({ length: COL2_COUNT }).map((_, i) => (
                  <div
                    key={i}
                    className="h-10 w-full rounded-xl border border-white/10 bg-white/5 sm:h-11"
                  />
                ))}
              </div>
            </div>
          ) : error ? (
            <div className="space-y-3 p-4">
              <div className="text-sm font-medium text-white">Não foi possível carregar.</div>
              <div className="text-sm text-zinc-300">
                Verifique sua conexão e as permissões (RLS) no Supabase.
              </div>
              <button
                type="button"
                onClick={reload}
                className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm text-white hover:bg-white/10"
              >
                Tentar novamente
              </button>
            </div>
          ) : lista.length === 0 ? (
            <div className="p-2">
              <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-zinc-300">
                Nenhuma região encontrada.
              </div>
            </div>
          ) : (
            <div className="grid gap-3 md:grid-cols-2 md:gap-4">
              <ul className="space-y-2">
                {col1.map((regiao) => (
                  <RegionItemLink
                    key={regiao.id}
                    effectiveStateId={effectiveStateId}
                    regiao={regiao}
                  />
                ))}
              </ul>
              <ul className="space-y-2">
                {col2.map((regiao) => (
                  <RegionItemLink
                    key={regiao.id}
                    effectiveStateId={effectiveStateId}
                    regiao={regiao}
                  />
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

