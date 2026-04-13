import { ChevronRight, MapPinned } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { State } from '../../types/domain'

type Props = {
  state: State
  to: string
  /** Texto curto abaixo do nome (ex.: disponibilidade). */
  availabilityHint?: string
}

export function HomeStateCard({ state, to, availabilityHint }: Props) {
  return (
    <li className="min-w-0">
      <Link
        to={to}
        className="group relative block overflow-hidden rounded-2xl border border-white/12 bg-gradient-to-br from-[#2d1f44]/70 via-[#251b36]/60 to-[#0c111f]/90 p-6 shadow-[0_20px_50px_rgba(0,0,0,0.35)] outline-none transition duration-300 hover:border-[#b66570]/45 hover:shadow-[0_24px_60px_rgba(81,47,92,0.25)] focus-visible:ring-2 focus-visible:ring-[#ed9e6f]/35 active:scale-[0.99] sm:p-8"
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background:
              'radial-gradient(800px circle at 90% 10%, rgba(182,101,112,0.12), transparent 45%), radial-gradient(600px circle at 10% 90%, rgba(237,158,111,0.08), transparent 40%)',
          }}
          aria-hidden
        />

        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
          <div className="flex min-w-0 flex-1 gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-[#512f5c]/50 text-[#ed9e6f] shadow-inner sm:h-14 sm:w-14">
              <MapPinned className="h-6 w-6 sm:h-7 sm:w-7" strokeWidth={1.5} aria-hidden />
            </div>
            <div className="min-w-0">
              {availabilityHint ? (
                <p className="mb-1 text-[11px] font-medium uppercase tracking-wider text-[#80466e]">
                  {availabilityHint}
                </p>
              ) : null}
              <h2 className="text-xl font-semibold tracking-tight text-white sm:text-2xl">
                {state.nome}
              </h2>
              <p className="mt-1.5 text-sm leading-relaxed text-zinc-400">
                Acesse as regiões, cidades e categorias cadastradas para este estado.
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center justify-between gap-3 sm:flex-col sm:items-end sm:justify-center">
            <span className="inline-flex items-center gap-1.5 text-sm font-medium text-[#ed9e6f] transition group-hover:text-[#f0b080]">
              Explorar estado
              <ChevronRight
                className="h-4 w-4 transition group-hover:translate-x-0.5"
                strokeWidth={2}
                aria-hidden
              />
            </span>
          </div>
        </div>
      </Link>
    </li>
  )
}
