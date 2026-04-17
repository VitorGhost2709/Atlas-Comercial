import { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { ReloadIconButton } from '../components/ReloadIconButton'
import { useLojasByEmpresaCityAndCategory } from '../hooks/useLojasByEmpresaCityAndCategory'
import { useLojasCatalogLabels } from '../hooks/useLojasCatalogLabels'
import type { StoresRouteParams } from '../routes/routeTypes'
import { buildLojasExportBasename } from '../utils/buildEmpresasExportBasename'
import { extractNeighborhood } from '../utils/extractNeighborhood'
import type { EmpresasPdfContext } from '../utils/exportEmpresasPdf'
import { labelEstadoFromRoute } from '../utils/labelEstadoFromRoute'
import { slugifyForFilename } from '../utils/slugifyForFilename'
import { textoOuEmDash } from '../utils/textoOuEmDash'
import { EmpresasExportMenu } from '../components/EmpresasExportMenu'

function CampoLoja({
  label,
  value,
  destaque,
  valueNoWrap,
}: {
  label: string
  value: string
  destaque?: boolean
  /** Evita quebra do valor em desktop (ex.: telefones). */
  valueNoWrap?: boolean
}) {
  return (
    <div className="min-w-0">
      <div className="text-[10px] font-medium uppercase tracking-wider text-[#80466e] sm:text-[11px]">
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

export function StoresPage() {
  const { stateId, cityId, categoryId, companyId } = useParams<StoresRouteParams>()

  const { data: lojas, loading, error, reload } = useLojasByEmpresaCityAndCategory(
    companyId ?? null,
    cityId ?? null,
    categoryId ?? null,
  )

  const catalogLabels = useLojasCatalogLabels(cityId ?? null, categoryId ?? null, companyId ?? null)

  const lista = useMemo(() => {
    const searchLabel = catalogLabels.data?.empresaNome?.trim()
    if (!lojas?.length) return []
    if (!searchLabel) return lojas

    return lojas.map((loja) => {
      const bairro = extractNeighborhood(loja.endereco)
      const finalDisplayName = bairro ? `${searchLabel} - ${bairro}` : searchLabel

      return {
        ...loja,
        nome_estabelecimento: finalDisplayName,
      }
    })
  }, [catalogLabels.data?.empresaNome, lojas])
  const idsValidos = Boolean(cityId?.trim() && categoryId?.trim() && companyId?.trim())

  const exportBasename = useMemo(() => {
    if (catalogLabels.data) {
      return buildLojasExportBasename(catalogLabels.data.cidadeNome, catalogLabels.data.categoriaNome)
    }
    if (cityId?.trim() && categoryId?.trim()) {
      return `lojas-${slugifyForFilename(cityId)}-${slugifyForFilename(categoryId)}`
    }
    return 'lojas-export'
  }, [catalogLabels.data, cityId, categoryId])

  const pdfContext = useMemo((): EmpresasPdfContext | null => {
    if (!catalogLabels.data) return null
    return {
      estado: labelEstadoFromRoute(stateId),
      regiao: catalogLabels.data.regiaoNome,
      cidade: catalogLabels.data.cidadeNome,
      categoria: catalogLabels.data.categoriaNome,
    }
  }, [catalogLabels.data, stateId])

  const exportDisabled = !idsValidos || loading || Boolean(error) || lista.length === 0

  const exportDisabledTitle = !idsValidos
    ? 'Rota incompleta: falta cidade, categoria ou empresa na URL.'
    : loading
      ? 'Aguarde o carregamento da lista.'
      : error
        ? 'Não foi possível carregar a lista.'
        : lista.length === 0
          ? 'Não há lojas para exportar neste contexto.'
          : undefined

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-white">Lojas</h1>
        <p className="text-sm leading-relaxed text-zinc-300">
          Unidades físicas cadastradas nesta cidade para a empresa e categoria escolhidas.
          {catalogLabels.data ? (
            <>
              {' '}
              <span className="text-zinc-200">Empresa:</span>{' '}
              <span className="font-medium text-white">{catalogLabels.data.empresaNome}</span>
            </>
          ) : null}
        </p>
      </header>

      <div className="rounded-2xl border border-white/10 bg-[#2d1f44]/35 shadow-[0_20px_60px_rgba(0,0,0,0.45)] backdrop-blur">
        <div className="flex items-center justify-between gap-3 border-b border-white/10 px-5 py-4">
          <div className="text-sm font-medium text-zinc-100">Lista de lojas</div>
          <div className="flex shrink-0 items-center gap-2">
            <EmpresasExportMenu
              rows={lista}
              disabled={exportDisabled}
              disabledTitle={exportDisabledTitle}
              basename={exportBasename}
              pdfContext={pdfContext}
            />
            <ReloadIconButton onClick={reload} disabled={!idsValidos} />
          </div>
        </div>

        <div className="p-2 sm:p-3">
          {!idsValidos ? (
            <div className="p-4">
              <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-zinc-300">
                Rota incompleta: falta cidade, categoria ou empresa na URL.
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
                Verifique conexão e políticas RLS na tabela{' '}
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
                Nenhuma loja encontrada para esta empresa, cidade e categoria.
              </div>
            </div>
          ) : (
            <ul className="grid gap-3 p-2 sm:p-3">
              {lista.map((loja) => (
                <li key={loja.id}>
                  <article className="rounded-xl border border-white/10 bg-white/5 px-4 py-4 transition hover:border-[#b66570]/35 hover:bg-white/[0.07] sm:px-5 lg:px-6">
                    <div className="flex flex-col gap-4 lg:grid lg:grid-cols-[2fr_1.5fr_2.5fr] lg:gap-x-6 lg:gap-y-2">
                      <div className="min-w-0">
                        <CampoLoja
                          label="Loja"
                          value={textoOuEmDash(loja.nome_estabelecimento)}
                          destaque
                        />
                      </div>
                      <div className="min-w-0">
                        <CampoLoja
                          label="Telefone"
                          value={textoOuEmDash(loja.telefone_principal)}
                          valueNoWrap
                        />
                      </div>
                      <div className="min-w-0">
                        <CampoLoja label="Endereço" value={textoOuEmDash(loja.endereco)} />
                      </div>
                    </div>
                  </article>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  )
}

