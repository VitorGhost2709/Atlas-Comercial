import { useEffect, useState } from 'react'
import type { CitySearchResult } from '../services/citiesService'
import { searchCitiesByName } from '../services/citiesService'

const DEBOUNCE_MS = 320

export function SearchPage() {
  const [input, setInput] = useState('')
  const [debounced, setDebounced] = useState('')
  const [resultados, setResultados] = useState<CitySearchResult[] | null>(null)
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
      setResultados(null)
      setError(null)
      setLoading(false)
      return
    }

    let cancelled = false
    setLoading(true)
    setError(null)

    void searchCitiesByName(q)
      .then((rows) => {
        if (cancelled) return
        setResultados(rows)
      })
      .catch((err) => {
        if (cancelled) return
        setError(err)
        setResultados(null)
      })
      .finally(() => {
        if (cancelled) return
        setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [debounced, retryKey])

  const trimmed = debounced.trim()
  const showResultsArea = trimmed.length > 0

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-white">Buscar cidades</h1>
        <p className="text-sm leading-relaxed text-zinc-300">
          Digite o nome (ou parte dele) para encontrar uma cidade e ver em qual região de Minas ela
          está.
        </p>
      </header>

      <div className="rounded-2xl border border-white/10 bg-[#2d1f44]/35 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.45)] backdrop-blur">
        <label className="block text-sm font-medium text-zinc-200" htmlFor="city-search">
          Nome da cidade
        </label>
        <div className="mt-2">
          <input
            id="city-search"
            type="search"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ex.: Belo Horizonte, Uberlândia…"
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
            </div>
          </div>

          <div className="p-2 sm:p-3">
            {loading ? (
              <div className="space-y-2 p-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    // eslint-disable-next-line react/no-array-index-key
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
            ) : (resultados ?? []).length === 0 ? (
              <div className="p-4">
                <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-zinc-300">
                  Nenhuma cidade encontrada para essa busca.
                </div>
              </div>
            ) : (
              <ul className="grid gap-2 p-2 sm:p-3">
                {(resultados ?? []).map((item) => (
                  <li key={item.id}>
                    <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 transition hover:border-white/20 hover:bg-white/8">
                      <div className="text-sm font-medium text-zinc-100">{item.nome}</div>
                      <div className="mt-1 text-xs text-[#80466e]">
                        Região:{' '}
                        <span className="text-[#ed9e6f]/90">
                          {item.regiao_nome ?? '—'}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
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
