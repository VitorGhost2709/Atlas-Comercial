import { Check, SlidersHorizontal } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ReloadIconButton } from '../components/ReloadIconButton'
import { useCities } from '../hooks/useCities'
import type { CitiesRouteParams } from '../routes/routeTypes'
import { ROUTES } from '../routes/paths'
import type { CityRow } from '../services/citiesService'
import { formatPopulacaoExibicao } from '../utils/formatPopulacao'
import { normalizeSearchString } from '../utils/normalizeSearchString'

type SortMode = 'alphabetical' | 'population'

function sortCities(list: CityRow[], mode: SortMode): CityRow[] {
  const copy = [...list]
  if (mode === 'alphabetical') {
    copy.sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR', { sensitivity: 'base' }))
    return copy
  }
  copy.sort((a, b) => {
    const pa = a.populacao
    const pb = b.populacao
    const aMissing = pa == null || Number.isNaN(Number(pa))
    const bMissing = pb == null || Number.isNaN(Number(pb))
    if (aMissing && bMissing) {
      return a.nome.localeCompare(b.nome, 'pt-BR', { sensitivity: 'base' })
    }
    if (aMissing) return 1
    if (bMissing) return -1
    const na = Number(pa)
    const nb = Number(pb)
    if (nb !== na) return nb - na
    return a.nome.localeCompare(b.nome, 'pt-BR', { sensitivity: 'base' })
  })
  return copy
}

function CitiesSortMenu({
  disabled,
  sortMode,
  onSortChange,
  regionKey,
}: {
  disabled: boolean
  sortMode: SortMode
  onSortChange: (mode: SortMode) => void
  regionKey: string
}) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setOpen(false)
  }, [regionKey])

  useEffect(() => {
    if (!open) return
    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  const select = (mode: SortMode) => {
    onSortChange(mode)
    setOpen(false)
  }

  const populationActive = sortMode === 'population'
  const menuOpenStyle = open
  const nonDefaultSort = populationActive

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        disabled={disabled}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label="Ordenar lista de cidades"
        onClick={() => {
          if (!disabled) setOpen((o) => !o)
        }}
        className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg outline-none transition disabled:cursor-not-allowed disabled:opacity-40 ${
          menuOpenStyle
            ? 'border border-[#ed9e6f]/70 bg-[#512f5c]/5 text-[#ed9e6f] shadow-[0_0_0_1px_rgba(237,158,111,0.35)]'
            : nonDefaultSort
              ? 'border border-[#ed9e6f]/50 bg-[#512f5c]/35 text-[#ed9e6f]'
              : 'border border-white/15 bg-white/5 text-zinc-300 hover:border-white/22 hover:bg-white/10'
        }`}
      >
        <SlidersHorizontal className="h-4 w-4" strokeWidth={1.75} aria-hidden />
      </button>

      {open ? (
        <ul
          role="listbox"
          aria-label="Opções de ordenação"
          className="absolute right-0 top-full z-50 mt-1.5 min-w-[13.5rem] overflow-hidden rounded-xl border border-white/12 bg-[#0c111f]/98 py-1 shadow-[0_16px_48px_rgba(0,0,0,0.55)] backdrop-blur-md max-[360px]:right-auto max-[360px]:left-0 max-[360px]:min-w-[min(13.5rem,calc(100vw-2.5rem))]"
        >
          <li role="presentation">
            <button
              type="button"
              role="option"
              aria-selected={sortMode === 'alphabetical'}
              onClick={() => select('alphabetical')}
              className={`flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm transition ${
                sortMode === 'alphabetical'
                  ? 'bg-[#512f5c]/55 text-[#ed9e6f]'
                  : 'text-zinc-200 hover:bg-white/[0.07]'
              }`}
            >
              <span className="flex w-4 shrink-0 justify-center" aria-hidden>
                {sortMode === 'alphabetical' ? (
                  <Check className="h-4 w-4 text-[#ed9e6f]" strokeWidth={2} />
                ) : null}
              </span>
              Ordem alfabética
            </button>
          </li>
          <li role="presentation">
            <button
              type="button"
              role="option"
              aria-selected={sortMode === 'population'}
              onClick={() => select('population')}
              className={`flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm transition ${
                sortMode === 'population'
                  ? 'bg-[#512f5c]/55 text-[#ed9e6f]'
                  : 'text-zinc-200 hover:bg-white/[0.07]'
              }`}
            >
              <span className="flex w-4 shrink-0 justify-center" aria-hidden>
                {sortMode === 'population' ? (
                  <Check className="h-4 w-4 text-[#ed9e6f]" strokeWidth={2} />
                ) : null}
              </span>
              Ordem populacional
            </button>
          </li>
        </ul>
      ) : null}
    </div>
  )
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <path
        d="M15.803 15.803 21 21"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function CitiesPage() {
  const { stateId, regionId } = useParams<CitiesRouteParams>()
  const effectiveStateId = stateId ?? 'mg'
  const { data: cidades, loading, error, reload } = useCities(regionId ?? null)
  const [filtroLocal, setFiltroLocal] = useState('')
  const [sortMode, setSortMode] = useState<SortMode>('alphabetical')

  useEffect(() => {
    setFiltroLocal('')
    setSortMode('alphabetical')
  }, [regionId])

  const cidadesExibidas = useMemo(() => {
    const lista = cidades ?? []
    const ordenada = sortCities(lista, sortMode)
    const q = filtroLocal.trim()
    if (!q) return ordenada
    const nq = normalizeSearchString(q)
    return ordenada.filter((c) => normalizeSearchString(c.nome).includes(nq))
  }, [cidades, sortMode, filtroLocal])

  const listaCarregada = (cidades ?? []).length > 0
  const buscaDesabilitada = loading || !!error || !listaCarregada
  const regionKey = regionId ?? ''

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-white">Cidades</h1>
        <p className="text-sm leading-relaxed text-zinc-300">
          Aqui estão as cidades da região selecionada. Se você preferir, use a busca global
          para encontrar uma cidade e ver a região dela.
        </p>
      </header>

      <div className="rounded-2xl border border-white/10 bg-[#2d1f44]/35 shadow-[0_20px_60px_rgba(0,0,0,0.45)] backdrop-blur">
        <div className="flex flex-col gap-3 border-b border-white/10 px-4 py-4 sm:px-5 lg:flex-row lg:flex-wrap lg:items-center lg:gap-3">
          <div className="flex min-w-0 shrink-0 items-center justify-between gap-3 lg:justify-start">
            <div className="text-sm font-medium text-zinc-100">Lista de cidades</div>
            <div className="flex items-center gap-2 lg:hidden">
              <CitiesSortMenu
                disabled={buscaDesabilitada}
                sortMode={sortMode}
                onSortChange={setSortMode}
                regionKey={regionKey}
              />
              <ReloadIconButton onClick={reload} />
            </div>
          </div>

          <div className="relative min-w-0 flex-1 lg:max-w-md lg:flex-[1_1_14rem]">
            <label htmlFor="cities-local-search" className="sr-only">
              Filtrar cidades por nome
            </label>
            <input
              id="cities-local-search"
              type="search"
              value={filtroLocal}
              onChange={(e) => setFiltroLocal(e.target.value)}
              placeholder="Buscar cidade…"
              autoComplete="off"
              disabled={buscaDesabilitada}
              className="peer w-full rounded-full border border-white/12 bg-[#0c111f]/70 py-2.5 pl-4 pr-11 text-sm text-zinc-100 placeholder:text-zinc-500 outline-none transition hover:border-white/18 focus:border-[#b66570]/45 focus:ring-2 focus:ring-[#ed9e6f]/20 disabled:cursor-not-allowed disabled:opacity-50"
            />
            <span
              className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[#80466e] transition peer-focus:text-[#ed9e6f]"
              aria-hidden
            >
              <SearchIcon />
            </span>
          </div>

          <div className="hidden items-center gap-2 lg:flex lg:shrink-0">
            <CitiesSortMenu
              disabled={buscaDesabilitada}
              sortMode={sortMode}
              onSortChange={setSortMode}
              regionKey={regionKey}
            />
            <ReloadIconButton onClick={reload} />
          </div>
        </div>

        <div className="p-2 sm:p-3">
          {loading ? (
            <div className="space-y-2 p-2">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="h-11 w-full rounded-xl border border-white/10 bg-white/5"
                />
              ))}
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
          ) : !listaCarregada ? (
            <div className="p-4">
              <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-zinc-300">
                Nenhuma cidade encontrada para esta região.
              </div>
            </div>
          ) : cidadesExibidas.length === 0 ? (
            <div className="p-4">
              <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-zinc-300">
                Nenhuma cidade encontrada para este termo.
              </div>
            </div>
          ) : (
            <ul className="grid gap-2 p-2 sm:p-3">
              {cidadesExibidas.map((cidade) => {
                const popLabel = formatPopulacaoExibicao(cidade.populacao)
                const semPopulacao =
                  cidade.populacao == null || Number.isNaN(Number(cidade.populacao))
                return (
                  <li key={cidade.id}>
                    <Link
                      to={ROUTES.categories(effectiveStateId, regionId ?? '', cidade.id)}
                      className="flex min-h-[2.75rem] items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 outline-none transition hover:border-[#b66570]/35 hover:bg-white/[0.07] focus-visible:ring-2 focus-visible:ring-[#ed9e6f]/30 active:scale-[0.99] sm:min-h-0 sm:px-4 sm:py-3"
                    >
                      <span className="min-w-0 flex-1 text-sm font-medium leading-snug text-zinc-100">
                        {cidade.nome}
                      </span>
                      <span
                        className={`shrink-0 tabular-nums text-xs leading-snug sm:text-sm ${
                          semPopulacao ? 'text-zinc-500' : 'text-zinc-400'
                        }`}
                      >
                        {popLabel}
                      </span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </div>
    </section>
  )
}
