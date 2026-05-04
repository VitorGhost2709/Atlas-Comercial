import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ReloadIconButton } from '../components/ReloadIconButton'
import { useEmpresasByCityAndCategory } from '../hooks/useEmpresasByCityAndCategory'
import type { CompaniesRouteParams } from '../routes/routeTypes'
import { ROUTES } from '../routes/paths'
import { normalizeSearchString } from '../utils/normalizeSearchString'
import { textoOuEmDash } from '../utils/textoOuEmDash'

function CampoClinica({
  label,
  value,
  destaque,
  labelNoWrap,
  valueNoWrap,
  valueNoClip,
}: {
  label: string
  value: string
  destaque?: boolean
  labelNoWrap?: boolean
  valueNoWrap?: boolean
  /** Mantém em uma linha no desktop sem cortar com reticências (ex.: telefone). */
  valueNoClip?: boolean
}) {
  return (
    <div className="min-w-0">
      <div
        className={`text-[10px] font-medium uppercase tracking-wider text-[#80466e] sm:text-[11px] ${
          labelNoWrap ? 'whitespace-nowrap tracking-wide sm:tracking-wider' : ''
        }`}
      >
        {label}
      </div>
      <div
        className={`mt-1 text-sm leading-snug ${
          destaque ? 'font-semibold text-zinc-100' : 'font-normal text-zinc-300'
        } ${
          valueNoClip
            ? 'lg:whitespace-nowrap'
            : valueNoWrap
              ? 'lg:whitespace-nowrap lg:overflow-hidden lg:text-ellipsis'
              : 'break-words'
        }`}
      >
        {value}
      </div>
    </div>
  )
}

export function CompaniesPage() {
  const { stateId, regionId, cityId, categoryId } = useParams<CompaniesRouteParams>()
  const effectiveStateId = stateId ?? 'mg'
  const [filtro, setFiltro] = useState('')

  const { data: listing, loading, error, reload } = useEmpresasByCityAndCategory(
    cityId ?? null,
    categoryId ?? null,
  )

  useEffect(() => {
    if (!import.meta.env.DEV) return
    if (!listing) return
    // Logs temporários para diagnóstico de runtime.
    // eslint-disable-next-line no-console
    console.log('[CompaniesPage]', {
      variant: listing.variant,
      grouped: listing.variant === 'grouped' ? listing.rows.length : undefined,
      clinics: listing.variant === 'clinics' ? listing.rows.length : undefined,
      hybridEmpresas: listing.variant === 'hybrid' ? listing.empresas.length : undefined,
      hybridLojasAvulsas: listing.variant === 'hybrid' ? listing.lojasAvulsas.length : undefined,
    })
  }, [listing])

  const idsValidos = Boolean(cityId?.trim() && categoryId?.trim() && regionId?.trim())

  const storesBaseRoute = useMemo(() => {
    if (!idsValidos) return null
    return (companyId: string) =>
      ROUTES.stores(effectiveStateId, regionId ?? '', cityId ?? '', categoryId ?? '', companyId)
  }, [categoryId, cityId, effectiveStateId, idsValidos, regionId])

  const variant = listing?.variant ?? 'grouped'
  const isClinics = variant === 'clinics'
  const isHybrid = variant === 'hybrid'

  const rowsGroupedRaw = listing?.variant === 'grouped' ? listing.rows : listing?.variant === 'hybrid' ? listing.empresas : []
  const rowsClinicsRaw = listing?.variant === 'clinics' ? listing.rows : []
  const rowsAvulsasRaw = listing?.variant === 'hybrid' ? listing.lojasAvulsas : []

  const { rowsGrouped, rowsClinics, rowsAvulsas } = useMemo(() => {
    const q = filtro.trim()
    if (!q) return { rowsGrouped: rowsGroupedRaw, rowsClinics: rowsClinicsRaw, rowsAvulsas: rowsAvulsasRaw }
    const nq = normalizeSearchString(q)
    const includes = (s: string | null | undefined) => normalizeSearchString(s ?? '').includes(nq)

    return {
      rowsGrouped: rowsGroupedRaw.filter((e) => includes(e.nome_empresa)),
      rowsClinics: rowsClinicsRaw.filter((l) =>
        includes(l.nome_estabelecimento) || includes(l.endereco) || includes(l.telefone_principal) || includes(l.whatsapp),
      ),
      rowsAvulsas: rowsAvulsasRaw.filter((l) =>
        includes(l.nome_estabelecimento) || includes(l.endereco) || includes(l.telefone_principal) || includes(l.whatsapp),
      ),
    }
  }, [filtro, rowsAvulsasRaw, rowsClinicsRaw, rowsGroupedRaw])

  const listaVazia =
    !loading &&
    !error &&
    listing &&
    (isClinics
      ? rowsClinics.length === 0
      : isHybrid
        ? rowsGrouped.length === 0 && rowsAvulsas.length === 0
        : rowsGrouped.length === 0)

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-white">Empresas</h1>
        <p className="text-sm leading-relaxed text-zinc-300">
          {isClinics
            ? 'Clínicas cadastradas nesta cidade para a categoria escolhida. Selecione uma unidade para ver detalhes e demais lojas da mesma marca, se houver.'
            : 'Redes/marcas cadastradas nesta cidade para a categoria escolhida. Escolha uma para ver as lojas/unidades físicas.'}
        </p>
      </header>

      <div className="rounded-2xl border border-white/10 bg-[#2d1f44]/35 shadow-[0_20px_60px_rgba(0,0,0,0.45)] backdrop-blur">
        <div className="flex flex-col gap-3 border-b border-white/10 px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="text-sm font-medium text-zinc-100">
            {isClinics ? 'Lista de clínicas' : isHybrid ? 'Empresas' : 'Lista de empresas'}
          </div>
          <div className="flex items-center gap-3">
            <div className="min-w-0 flex-1 lg:w-[22rem] lg:flex-initial">
              <label className="sr-only" htmlFor="companies-filter">
                Filtrar resultados
              </label>
              <input
                id="companies-filter"
                type="search"
                value={filtro}
                onChange={(e) => setFiltro(e.target.value)}
                placeholder="Filtrar empresas/lojas…"
                autoComplete="off"
                disabled={!idsValidos || loading || Boolean(error)}
                className="w-full rounded-xl border border-white/12 bg-[#0c111f]/70 px-4 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-500 outline-none transition hover:border-white/18 focus:border-[#b66570]/45 focus:ring-2 focus:ring-[#ed9e6f]/20 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            <ReloadIconButton onClick={reload} disabled={!idsValidos} />
          </div>
        </div>

        <div className="p-2 sm:p-3">
          {!idsValidos ? (
            <div className="p-4">
              <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-zinc-300">
                Rota incompleta: falta cidade, categoria ou região na URL.
              </div>
            </div>
          ) : loading ? (
            <div className="space-y-2 p-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="h-28 w-full rounded-xl border border-white/10 bg-white/5 sm:h-24"
                />
              ))}
            </div>
          ) : error ? (
            <div className="space-y-3 p-4">
              <div className="text-sm font-medium text-white">Não foi possível carregar.</div>
              <p className="text-sm text-zinc-300">
                Verifique conexão e políticas RLS nas tabelas{' '}
                <span className="font-mono text-xs">empresas</span> e{' '}
                <span className="font-mono text-xs">lojas</span>.
              </p>
              <button
                type="button"
                onClick={reload}
                className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm text-white hover:bg-white/10"
              >
                Tentar novamente
              </button>
            </div>
          ) : listaVazia ? (
            <div className="p-4">
              <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-zinc-300">
                {isClinics
                  ? 'Nenhuma clínica encontrada para esta cidade e categoria.'
                  : isHybrid
                    ? 'Nenhum resultado encontrado para esta cidade e categoria.'
                    : 'Nenhuma empresa encontrada para esta cidade e categoria.'}
              </div>
            </div>
          ) : isClinics ? (
            <ul className="grid gap-3 p-2 sm:p-3">
              {rowsClinics.map((loja) => (
                <li key={loja.id}>
                  <Link
                    to={storesBaseRoute && loja.empresa_id ? storesBaseRoute(loja.empresa_id) : '#'}
                    className="block rounded-xl border border-white/10 bg-white/5 px-4 py-4 outline-none transition hover:border-[#b66570]/35 hover:bg-white/[0.07] focus-visible:ring-2 focus-visible:ring-[#ed9e6f]/30 active:scale-[0.99] sm:px-5 lg:px-6"
                  >
                    <div className="flex flex-col gap-4 lg:grid lg:grid-cols-12 lg:gap-x-4 lg:gap-y-2">
                      <div className="lg:col-span-3">
                        <CampoClinica
                          label="Estabelecimento"
                          value={textoOuEmDash(loja.nome_estabelecimento)}
                          destaque
                        />
                      </div>
                      <div className="lg:col-span-2">
                        <CampoClinica
                          label="Responsável de compras"
                          value={textoOuEmDash(loja.nome_responsavel_compras)}
                          labelNoWrap
                        />
                      </div>
                      <div className="lg:col-span-2">
                        <CampoClinica
                          label="Telefone"
                          value={textoOuEmDash(loja.telefone_principal)}
                          valueNoWrap
                        />
                      </div>
                      <div className="lg:col-span-2">
                        <CampoClinica
                          label="WhatsApp"
                          value={textoOuEmDash(loja.whatsapp)}
                          valueNoWrap
                        />
                      </div>
                      <div className="lg:col-span-3">
                        <CampoClinica label="Endereço" value={textoOuEmDash(loja.endereco)} />
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : isHybrid ? (
            <div className="space-y-4 p-2 sm:p-3">
              {rowsGrouped.length > 0 ? (
                <div className="space-y-2">
                  <div className="px-2 text-[11px] font-medium uppercase tracking-wider text-zinc-400">
                    Empresas
                  </div>
                  <ul className="grid gap-3">
                    {rowsGrouped.map((empresa) => (
                      <li key={empresa.id}>
                        <Link
                          to={storesBaseRoute ? storesBaseRoute(empresa.id) : '#'}
                          className="block rounded-xl border border-white/10 bg-white/5 px-4 py-4 outline-none transition hover:border-[#b66570]/35 hover:bg-white/[0.07] focus-visible:ring-2 focus-visible:ring-[#ed9e6f]/30 active:scale-[0.99] sm:px-5 lg:px-6"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="min-w-0">
                              <div className="text-[10px] font-medium uppercase tracking-wider text-[#80466e] sm:text-[11px]">
                                Empresa
                              </div>
                              <div className="mt-1 break-words text-sm font-semibold leading-snug text-zinc-100">
                                {empresa.nome_empresa}
                              </div>
                            </div>

                            <div className="shrink-0 pt-0.5">
                              <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-medium text-zinc-200">
                                {empresa.total_lojas} lojas
                              </span>
                            </div>
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {rowsAvulsas.length > 0 ? (
                <div className="space-y-2">
                  <div className="px-2 text-[11px] font-medium uppercase tracking-wider text-zinc-400">
                    Lojas avulsas
                  </div>
                  <ul className="grid gap-3">
                    {rowsAvulsas.map((loja) => (
                      <li key={loja.id}>
                        <Link
                          to={ROUTES.store(
                            effectiveStateId,
                            regionId ?? '',
                            cityId ?? '',
                            categoryId ?? '',
                            loja.id,
                          )}
                          className="block rounded-xl border border-white/10 bg-white/5 px-4 py-4 outline-none transition hover:border-[#b66570]/35 hover:bg-white/[0.07] focus-visible:ring-2 focus-visible:ring-[#ed9e6f]/30 active:scale-[0.99] sm:px-5 lg:px-6"
                        >
                          <div className="flex flex-col gap-4 lg:grid lg:grid-cols-12 lg:gap-x-4 lg:gap-y-2">
                            <div className="lg:col-span-4">
                              <CampoClinica
                                label="Loja avulsa"
                                value={textoOuEmDash(loja.nome_estabelecimento)}
                                destaque
                              />
                            </div>
                            <div className="lg:col-span-3">
                              <CampoClinica
                                label="Telefone"
                                value={textoOuEmDash(loja.telefone_principal)}
                                valueNoClip
                              />
                            </div>
                            <div className="lg:col-span-5">
                              <CampoClinica label="Endereço" value={textoOuEmDash(loja.endereco)} />
                            </div>
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          ) : (
            <ul className="grid gap-3 p-2 sm:p-3">
              {rowsGrouped.map((empresa) => (
                <li key={empresa.id}>
                  <Link
                    to={storesBaseRoute ? storesBaseRoute(empresa.id) : '#'}
                    className="block rounded-xl border border-white/10 bg-white/5 px-4 py-4 outline-none transition hover:border-[#b66570]/35 hover:bg-white/[0.07] focus-visible:ring-2 focus-visible:ring-[#ed9e6f]/30 active:scale-[0.99] sm:px-5 lg:px-6"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <div className="text-[10px] font-medium uppercase tracking-wider text-[#80466e] sm:text-[11px]">
                          Empresa
                        </div>
                        <div className="mt-1 break-words text-sm font-semibold leading-snug text-zinc-100">
                          {empresa.nome_empresa}
                        </div>
                      </div>

                      <div className="shrink-0 pt-0.5">
                        <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-medium text-zinc-200">
                          {empresa.total_lojas} lojas
                        </span>
                      </div>
                    </div>
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
