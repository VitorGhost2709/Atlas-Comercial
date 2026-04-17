import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import type { CitySearchResult } from '../services/citiesService'
import { searchCitiesByName } from '../services/citiesService'
import type { RegionRow } from '../services/regionsService'
import { searchRegionsByName } from '../services/regionsService'
import { ROUTES } from '../routes/paths'
import { STATES } from '../utils/states'
import { normalizeSearchString } from '../utils/normalizeSearchString'

const DEBOUNCE_MS = 320

export function SearchPage() {
  const [input, setInput] = useState('')
  const [debounced, setDebounced] = useState('')
  const [cidades, setCidades] = useState<CitySearchResult[] | null>(null)
  const [regioes, setRegioes] = useState<RegionRow[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<unknown>(null)
  const [retryKey, setRetryKey] = useState(0)

  useEffect(() => {
    const t = window.setTimeout(() => setDebounced(input), DEBOUNCE_MS)
    return () => window.clearTimeout(t)
  }, [input])

  useEffect(() => {
    const q = debounced.trim()
    if (!q) {
      setCidades(null)
      setRegioes(null)
      setError(null)
      setLoading(false)
      return
    }

    let cancelled = false
    setLoading(true)
    setError(null)

    void Promise.all([searchRegionsByName(q), searchCitiesByName(q)]).then(([r, c]) => {
        if (cancelled) return
        setRegioes(r)
        setCidades(c)
      }).catch((err) => {
        if (cancelled) return
        setError(err)
        setRegioes(null)
        setCidades(null)
      }).finally(() => {
        if (cancelled) return
        setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [debounced, retryKey])

  const trimmed = debounced.trim()
  const showResultsArea = trimmed.length > 0

  const estados = useMemo(() => {
    const q = trimmed.trim()
    if (!q) return []
    const nq = normalizeSearchString(q)
    return STATES.filter((s) => {
      const hay = `${s.nome} ${s.sigla} ${s.id}`
      return normalizeSearchString(hay).includes(nq)
    })
  }, [trimmed])

  const total = estados.length + (regioes ?? []).length + (cidades ?? []).length

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-white">Buscar</h1>
        <p className="text-sm leading-relaxed text-zinc-300">
          Pesquise por estado, região ou cidade para navegar rapidamente no Atlas Comercial.
        </p>
      </header>

      <div className="rounded-2xl border border-white/10 bg-[#2d1f44]/35 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.45)] backdrop-blur">
        <label className="block text-sm font-medium text-zinc-200" htmlFor="global-search">
          Nome do estado, região ou cidade
        </label>
        <div className="mt-2">
          <input
            id="global-search"
            type="search"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ex.: Minas Gerais, Vale do Rio Doce, Ipatinga…"
            autoComplete="off"
            className="w-full rounded-xl border border-white/15 bg-[#0c111f]/80 px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-500 outline-none ring-[#ed9e6f]/0 transition focus:border-[#b66570]/60 focus:ring-2 focus:ring-[#ed9e6f]/25"
          />
        </div>
        {input.trim() !== debounced.trim() && input.trim().length > 0 ? (
          <p className="mt-2 text-xs text-zinc-500">Aguardando você parar de digitar…</p>
        ) : null}
      </div>

      {showResultsArea ? (
        <div
          className="rounded-2xl border border-white/10 bg-[#2d1f44]/35 shadow-[0_20px_60px_rgba(0,0,0,0.45)] backdrop-blur"
          aria-busy={loading}
        >
          <div className="border-b border-white/10 px-5 py-4">
            <div className="text-sm font-medium text-zinc-100">Resultados</div>
            <div className="mt-0.5 text-xs text-zinc-400">
              Buscando por “<span className="text-zinc-300">{trimmed}</span>”
              {!loading ? (
                <>
                  {' '}
                  <span className="text-zinc-500">•</span>{' '}
                  <span className="text-zinc-300">{total}</span>{' '}
                  <span className="text-zinc-500">resultado(s)</span>
                </>
              ) : null}
            </div>
          </div>

          <div className="p-2 sm:p-3">
            {loading ? (
              <div className="space-y-2 p-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-[4.25rem] w-full rounded-xl border border-white/10 bg-white/5"
                  />
                ))}
              </div>
            ) : error ? (
              <div className="space-y-3 p-4">
                <div className="text-sm font-medium text-white">Não foi possível buscar.</div>
                <p className="text-sm text-zinc-300">
                  Verifique sua conexão e as permissões (RLS) no Supabase.
                </p>
                <button
                  type="button"
                  onClick={() => setRetryKey((k) => k + 1)}
                  className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm text-white hover:bg-white/10"
                >
                  Tentar novamente
                </button>
              </div>
            ) : total === 0 ? (
              <div className="p-4">
                <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-zinc-300">
                  Nenhum resultado encontrado para essa busca.
                </div>
              </div>
            ) : (
              <div className="space-y-3 p-2 sm:p-3">
                {estados.length > 0 ? (
                  <div className="space-y-2">
                    <div className="px-2 text-[11px] font-medium uppercase tracking-wider text-zinc-400">
                      Estados
                    </div>
                    <ul className="grid gap-2">
                      {estados.map((s) => (
                        <li key={s.id}>
                          <Link
                            to={ROUTES.regions(s.id)}
                            className="block rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none transition hover:border-white/20 hover:bg-white/8 focus-visible:ring-2 focus-visible:ring-[#ed9e6f]/30 active:scale-[0.99]"
                          >
                            <div className="flex items-center justify-between gap-3">
                              <div className="min-w-0">
                                <div className="text-sm font-medium text-zinc-100">{s.nome}</div>
                                <div className="mt-1 text-xs text-zinc-400">{s.sigla}</div>
                              </div>
                              <span className="shrink-0 rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[10px] font-medium uppercase tracking-wider text-zinc-300">
                                Estado
                              </span>
                            </div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                {(regioes ?? []).length > 0 ? (
                  <div className="space-y-2">
                    <div className="px-2 text-[11px] font-medium uppercase tracking-wider text-zinc-400">
                      Regiões
                    </div>
                    <ul className="grid gap-2">
                      {(regioes ?? []).map((r) => (
                        <li key={r.id}>
                          <Link
                            to={ROUTES.cities('mg', r.id)}
                            className="block rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none transition hover:border-white/20 hover:bg-white/8 focus-visible:ring-2 focus-visible:ring-[#ed9e6f]/30 active:scale-[0.99]"
                          >
                            <div className="flex items-center justify-between gap-3">
                              <div className="min-w-0 text-sm font-medium text-zinc-100">{r.nome}</div>
                              <span className="shrink-0 rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[10px] font-medium uppercase tracking-wider text-zinc-300">
                                Região
                              </span>
                            </div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                {(cidades ?? []).length > 0 ? (
                  <div className="space-y-2">
                    <div className="px-2 text-[11px] font-medium uppercase tracking-wider text-zinc-400">
                      Cidades
                    </div>
                    <ul className="grid gap-2">
                      {(cidades ?? []).map((c) => (
                        <li key={c.id}>
                          <Link
                            to={ROUTES.categories('mg', c.regiao_id ?? '', c.id)}
                            className="block rounded-xl border border-white/10 bg-white/5 px-4 py-3 outline-none transition hover:border-white/20 hover:bg-white/8 focus-visible:ring-2 focus-visible:ring-[#ed9e6f]/30 active:scale-[0.99]"
                          >
                            <div className="flex items-center justify-between gap-3">
                              <div className="min-w-0">
                                <div className="text-sm font-medium text-zinc-100">{c.nome}</div>
                                <div className="mt-1 text-xs text-[#80466e]">
                                  Região:{' '}
                                  <span className="text-[#ed9e6f]/90">{c.regiao_nome ?? '—'}</span>
                                </div>
                              </div>
                              <span className="shrink-0 rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[10px] font-medium uppercase tracking-wider text-zinc-300">
                                Cidade
                              </span>
                            </div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>
            )}
          </div>
        </div>
      ) : (
        <p className="text-center text-sm text-zinc-500">
          Digite no campo acima para ver os resultados aqui.
        </p>
      )}
    </section>
  )
}
