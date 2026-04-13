import { HomeHero } from '../components/home/HomeHero'
import { HomeStateCard } from '../components/home/HomeStateCard'
import { ROUTES } from '../routes/paths'
import { STATES } from '../utils/states'

export function StatesPage() {
  const multi = STATES.length > 1

  return (
    <div className="space-y-10 pb-6 sm:space-y-14 md:space-y-16">
      <HomeHero />

      <section className="space-y-5 sm:space-y-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-white sm:text-xl">
              {multi ? 'Selecione o estado' : 'Comece pelo estado'}
            </h2>
            <p className="mt-1 max-w-xl text-sm leading-relaxed text-zinc-400">
              {multi
                ? 'Escolha onde deseja navegar. Novos estados serão adicionados conforme o Atlas Comercial expande pelo país.'
                : 'Hoje o diretório está disponível para o primeiro estado. A mesma experiência se repetirá para demais unidades federativas em breve.'}
            </p>
          </div>
        </div>

        <ul
          className={
            multi
              ? 'grid gap-5 sm:grid-cols-2 lg:grid-cols-3'
              : 'mx-auto grid max-w-2xl gap-5 lg:max-w-3xl'
          }
        >
          {STATES.map((state, index) => (
            <HomeStateCard
              key={state.id}
              state={state}
              to={ROUTES.regions(state.id)}
              availabilityHint={
                STATES.length === 1
                  ? 'Estado disponível agora'
                  : index === 0
                    ? 'Disponível'
                    : undefined
              }
            />
          ))}
        </ul>
      </section>
    </div>
  )
}
