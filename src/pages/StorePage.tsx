import { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { ReloadIconButton } from '../components/ReloadIconButton'
import type { StoreRouteParams } from '../routes/routeTypes'
import { fetchLojaById } from '../services/lojasService'
import { useAsync } from '../hooks/useAsync'
import { textoOuEmDash } from '../utils/textoOuEmDash'

function Campo({
  label,
  value,
  destaque,
  valueNoWrap,
  valueNoClip,
}: {
  label: string
  value: string
  destaque?: boolean
  valueNoWrap?: boolean
  /** Uma linha no desktop sem cortar com reticências (ex.: telefone). */
  valueNoClip?: boolean
}) {
  return (
    <div className="min-w-0">
      <div className="text-[10px] font-medium uppercase tracking-wider text-[#80466e] sm:text-[11px]">
        {label}
      </div>
      <div
        className={`mt-1 text-sm leading-snug ${
          destaque ? 'font-semibold text-zinc-100' : 'font-normal text-zinc-300'
        } ${
          valueNoClip
            ? 'lg:whitespace-nowrap tabular-nums'
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

export function StorePage() {
  const { storeId } = useParams<StoreRouteParams>()

  const { data: loja, loading, error, reload } = useAsync(
    () => {
      const id = storeId?.trim()
      if (!id) return Promise.resolve(null)
      return fetchLojaById(id)
    },
    [storeId],
  )

  const title = useMemo(() => {
    const nome = loja?.nome_estabelecimento?.trim()
    return nome?.length ? nome : 'Loja'
  }, [loja?.nome_estabelecimento])

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-white">{title}</h1>
        <p className="text-sm leading-relaxed text-zinc-300">Detalhes da unidade cadastrada.</p>
      </header>

      <div className="rounded-2xl border border-white/10 bg-[#2d1f44]/35 shadow-[0_20px_60px_rgba(0,0,0,0.45)] backdrop-blur">
        <div className="flex items-center justify-between gap-3 border-b border-white/10 px-5 py-4">
          <div className="text-sm font-medium text-zinc-100">Detalhes</div>
          <ReloadIconButton onClick={reload} />
        </div>

        <div className="p-4 sm:p-5" aria-busy={loading}>
          {loading ? (
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-11 w-full rounded-xl border border-white/10 bg-white/5" />
              ))}
            </div>
          ) : error ? (
            <div className="space-y-3">
              <div className="text-sm font-medium text-white">Não foi possível carregar.</div>
              <div className="text-sm text-zinc-300">Verifique conexão e permissões (RLS).</div>
              <button
                type="button"
                onClick={reload}
                className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm text-white hover:bg-white/10"
              >
                Tentar novamente
              </button>
            </div>
          ) : !loja ? (
            <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-zinc-300">
              Loja não encontrada.
            </div>
          ) : (
            <div className="grid gap-4 lg:grid-cols-12 lg:gap-x-6 lg:gap-y-4">
              <div className="lg:col-span-4">
                <Campo label="Loja" value={textoOuEmDash(loja.nome_estabelecimento)} destaque />
              </div>
              <div className="lg:col-span-3">
                <Campo label="Telefone" value={textoOuEmDash(loja.telefone_principal)} valueNoClip />
              </div>
              <div className="lg:col-span-5">
                <Campo label="Endereço" value={textoOuEmDash(loja.endereco)} />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

