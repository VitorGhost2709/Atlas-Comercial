export function HomeHero() {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#2d1f44]/90 via-[#1a1428]/80 to-[#0c111f] px-5 py-12 shadow-[0_24px_80px_rgba(0,0,0,0.45)] sm:px-8 sm:py-14 md:px-12 md:py-20">
      <div
        className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#b66570]/15 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-[#512f5c]/20 blur-3xl"
        aria-hidden
      />

      <div className="relative mx-auto max-w-3xl text-center">
        <p className="mb-5 inline-flex items-center rounded-full border border-[#ed9e6f]/25 bg-[#512f5c]/35 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#ed9e6f] sm:text-xs">
          Diretório comercial por localização
        </p>

        <h1 className="bg-gradient-to-b from-white via-zinc-100 to-zinc-400 bg-clip-text text-4xl font-bold leading-[1.08] tracking-tight text-transparent sm:text-5xl md:text-6xl md:leading-[1.05]">
          Atlas Comercial
        </h1>

        <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-zinc-300 sm:text-lg">
          Encontre empresas por estado, região, cidade e categoria — uma navegação clara para quem
          prospecta com base em território e segmento.
        </p>

        <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-zinc-500 sm:text-[15px]">
          Escolha um estado para ver as regiões, depois as cidades e o catálogo de categorias. Em
          cada etapa você aproxima a lista do perfil comercial que busca.
        </p>
      </div>
    </div>
  )
}
