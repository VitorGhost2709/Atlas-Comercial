import { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ReloadIconButton } from '../components/ReloadIconButton'
import { useEmpresasByCityAndCategory } from '../hooks/useEmpresasByCityAndCategory'
import type { CompaniesRouteParams } from '../routes/routeTypes'
import { ROUTES } from '../routes/paths'
import { textoOuEmDash } from '../utils/textoOuEmDash'

function CampoEmpresa({
  label,
  value,
  destaque,
  labelNoWrap,
  valueNoWrap,
}: {
  label: string
  value: string
  destaque?: boolean
  /** Evita quebra do rótulo em duas linhas (ex.: “Responsável de compras”). */
  labelNoWrap?: boolean
  /** Evita quebra do valor em desktop (ex.: telefones). */
  valueNoWrap?: boolean
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
        } ${valueNoWrap ? 'lg:whitespace-nowrap lg:overflow-hidden lg:text-ellipsis' : 'break-words'}`}
      >
        {value}
      </div>
    </div>
  )
}

export function CompaniesPage() {
  const { stateId, regionId, cityId, categoryId } = useParams<CompaniesRouteParams>()
  const effectiveStateId = stateId ?? 'mg'

  const { data: empresas, loading, error, reload } = useEmpresasByCityAndCategory(
    cityId ?? null,
    categoryId ?? null,
  )

  const lista = empresas ?? []
  const idsValidos = Boolean(cityId?.trim() && categoryId?.trim() && regionId?.trim())

  const storesBaseRoute = useMemo(() => {
    if (!idsValidos) return null
    return (companyId: string) =>
      ROUTES.stores(effectiveStateId, regionId ?? '', cityId ?? '', categoryId ?? '', companyId)
  }, [categoryId, cityId, effectiveStateId, idsValidos, regionId])

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-white">Empresas</h1>
        <p className="text-sm leading-relaxed text-zinc-300">
          Redes/marcas cadastradas nesta cidade para a categoria escolhida. Escolha uma para ver as
          lojas/unidades físicas.
        </p>
      </header>

      <div className="rounded-2xl border border-white/10 bg-[#2d1f44]/35 shadow-[0_20px_60px_rgba(0,0,0,0.45)] backdrop-blur">
        <div className="flex items-center justify-between gap-3 border-b border-white/10 px-5 py-4">
          <div className="text-sm font-medium text-zinc-100">Lista de empresas</div>
          <ReloadIconButton onClick={reload} disabled={!idsValidos} />
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
          ) : lista.length === 0 ? (
            <div className="p-4">
              <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-zinc-300">
                Nenhuma empresa encontrada para esta cidade e categoria.
              </div>
            </div>
          ) : (
            <ul className="grid gap-3 p-2 sm:p-3">
              {lista.map((empresa) => (
                <li key={empresa.id}>
                  <Link
                    to={storesBaseRoute ? storesBaseRoute(empresa.id) : '#'}
                    className="block rounded-xl border border-white/10 bg-white/5 px-4 py-4 outline-none transition hover:border-[#b66570]/35 hover:bg-white/[0.07] focus-visible:ring-2 focus-visible:ring-[#ed9e6f]/30 active:scale-[0.99] sm:px-5 lg:px-6"
                  >
                    <div className="flex flex-col gap-4 lg:grid lg:grid-cols-[2fr_2fr_1.5fr_1.5fr] lg:gap-x-6 lg:gap-y-2">
                      <div className="min-w-0">
                        <CampoEmpresa label="Empresa" value={textoOuEmDash(empresa.nome)} destaque />
                      </div>
                      <div className="min-w-0">
                        <CampoEmpresa
                          label="Responsável de compras"
                          value={textoOuEmDash(empresa.nome_responsavel_compras)}
                          labelNoWrap
                        />
                      </div>
                      <div className="min-w-0">
                        <CampoEmpresa
                          label="Telefone"
                          value={textoOuEmDash(empresa.telefone_principal)}
                          valueNoWrap
                        />
                      </div>
                      <div className="min-w-0">
                        <CampoEmpresa
                          label="WhatsApp"
                          value={textoOuEmDash(empresa.whatsapp)}
                          valueNoWrap
                        />
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

