import { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { EmpresasExportMenu } from '../components/EmpresasExportMenu'
import { ReloadIconButton } from '../components/ReloadIconButton'
import { useCompaniesByCityAndCategory } from '../hooks/useCompaniesByCityAndCategory'
import { useEmpresasCatalogLabels } from '../hooks/useEmpresasCatalogLabels'
import type { EmpresasRouteParams } from '../routes/routeTypes'
import { buildEmpresasExportBasename } from '../utils/buildEmpresasExportBasename'
import type { EmpresasPdfContext } from '../utils/exportEmpresasPdf'
import { labelEstadoFromRoute } from '../utils/labelEstadoFromRoute'
import { slugifyForFilename } from '../utils/slugifyForFilename'
import { textoOuEmDash } from '../utils/textoOuEmDash'

function CampoEmpresa({
  label,
  value,
  destaque,
}: {
  label: string
  value: string
  destaque?: boolean
}) {
  return (
    <div className="min-w-0">
      <div className="text-[10px] font-medium uppercase tracking-wider text-[#80466e] sm:text-[11px]">
        {label}
      </div>
      <div
        className={`mt-1 break-words text-sm leading-snug ${
          destaque ? 'font-semibold text-zinc-100' : 'font-normal text-zinc-300'
        }`}
      >
        {value}
      </div>
    </div>
  )
}

export function EmpresasPage() {
  const { stateId, cityId, categoryId } = useParams<EmpresasRouteParams>()
  const { data: empresas, loading, error, reload } = useCompaniesByCityAndCategory(
    cityId ?? null,
    categoryId ?? null,
  )
  const catalogLabels = useEmpresasCatalogLabels(cityId ?? null, categoryId ?? null)

  const lista = empresas ?? []
  const idsValidos = Boolean(cityId?.trim() && categoryId?.trim())

  const exportBasename = useMemo(() => {
    if (catalogLabels.data) {
      return buildEmpresasExportBasename(
        catalogLabels.data.cidadeNome,
        catalogLabels.data.categoriaNome,
      )
    }
    if (cityId?.trim() && categoryId?.trim()) {
      return `empresas-${slugifyForFilename(cityId)}-${slugifyForFilename(categoryId)}`
    }
    return 'empresas-export'
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

  const exportDisabled =
    !idsValidos || loading || Boolean(error) || lista.length === 0

  const exportDisabledTitle = !idsValidos
    ? 'Rota incompleta: falta cidade ou categoria na URL.'
    : loading
      ? 'Aguarde o carregamento da lista.'
      : error
        ? 'Não foi possível carregar a lista.'
        : lista.length === 0
          ? 'Não há empresas para exportar neste contexto.'
          : undefined

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-white">Empresas</h1>
        <p className="text-sm leading-relaxed text-zinc-300">
          Estabelecimentos cadastrados nesta cidade para a categoria escolhida.
        </p>
      </header>

      <div className="rounded-2xl border border-white/10 bg-[#2d1f44]/35 shadow-[0_20px_60px_rgba(0,0,0,0.45)] backdrop-blur">
        <div className="flex items-center justify-between gap-3 border-b border-white/10 px-5 py-4">
          <div className="text-sm font-medium text-zinc-100">Lista de empresas</div>
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
                Rota incompleta: falta cidade ou categoria na URL.
              </div>
            </div>
          ) : loading ? (
            <div className="space-y-2 p-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  // eslint-disable-next-line react/no-array-index-key
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
                <span className="font-mono text-xs">empresas_clientes</span>. Se o anon não tiver
                permissão de leitura, a lista ficará bloqueada.
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
                  <article className="rounded-xl border border-white/10 bg-white/5 px-4 py-4 transition hover:border-[#b66570]/35 hover:bg-white/[0.07] sm:px-5">
                    <div className="flex flex-col gap-4 lg:grid lg:grid-cols-12 lg:gap-x-4 lg:gap-y-2">
                      <div className="lg:col-span-3">
                        <CampoEmpresa
                          label="Estabelecimento"
                          value={textoOuEmDash(empresa.nome_estabelecimento)}
                          destaque
                        />
                      </div>
                      <div className="lg:col-span-2">
                        <CampoEmpresa
                          label="Comprador"
                          value={textoOuEmDash(empresa.nome_responsavel_compras)}
                        />
                      </div>
                      <div className="lg:col-span-2">
                        <CampoEmpresa
                          label="Telefone"
                          value={textoOuEmDash(empresa.telefone_principal)}
                        />
                      </div>
                      <div className="lg:col-span-2">
                        <CampoEmpresa label="WhatsApp" value={textoOuEmDash(empresa.whatsapp)} />
                      </div>
                      <div className="lg:col-span-3">
                        <CampoEmpresa label="Endereço" value={textoOuEmDash(empresa.endereco)} />
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
