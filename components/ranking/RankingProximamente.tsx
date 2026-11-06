import Link from "next/link";
import { Banknote, CalendarDays, Swords, Trophy, Users } from "lucide-react";

const novedades = [
  {
    icono: Swords,
    titulo: "Cada partido suma",
    texto:
      "Tus victorias y los torneos que ganes te dan puntos. Cuanto más jugás y más ganás, más alto quedás.",
  },
  {
    icono: Banknote,
    titulo: "Premios para los mejores",
    texto:
      "Los mejores del ranking al cierre de cada mes cobran su premio, además de lo que ganen en cada torneo.",
  },
  {
    icono: CalendarDays,
    titulo: "Arranca de cero cada mes",
    texto:
      "Todos los meses el ranking se reinicia: siempre tenés una nueva oportunidad de llegar arriba.",
  },
  {
    icono: Users,
    titulo: "Por juego y por equipos",
    texto:
      "Una tabla para cada juego y un ranking propio para los torneos en equipo.",
  },
];

export default function RankingProximamente() {
  return (
    <section className="relative pt-24 lg:pt-36 pb-16 lg:pb-24 overflow-hidden">
      <div className="pointer-events-none absolute left-1/2 top-10 h-[280px] w-[280px] -translate-x-1/2 rounded-full bg-red-600/10 blur-[90px] lg:h-[480px] lg:w-[480px] lg:blur-[160px]" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-red-600/60 bg-red-600/10 px-4 py-1.5 text-xs sm:text-sm font-bold uppercase tracking-wider text-red-400">
            <span className="h-2 w-2 rounded-full bg-red-500 motion-safe:animate-pulse" />
            Próximamente
          </span>

          <h1 className="mt-6 text-3xl sm:text-5xl lg:text-6xl font-black leading-tight">
            Ranking <span className="text-red-600">Mensual</span>
          </h1>

          <p className="mt-5 text-lg sm:text-2xl font-bold text-white max-w-3xl mx-auto leading-snug">
            Muy pronto, ganar torneos no va a ser la única forma de llevarte un premio.
          </p>

          <p className="mt-4 text-zinc-400 text-base sm:text-lg max-w-2xl mx-auto leading-7 sm:leading-8">
            Estamos preparando un ranking donde cada partido que juegues suma
            puntos. Subí posiciones durante el mes y, si terminás entre los
            mejores, cobrás tu premio.
          </p>
        </div>

        <div className="mt-12 lg:mt-16 grid gap-4 sm:grid-cols-2 lg:gap-6">
          {novedades.map(({ icono: Icono, titulo, texto }) => (
            <div
              key={titulo}
              className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5 lg:p-7"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-600/15 text-red-500">
                <Icono className="h-6 w-6" />
              </div>
              <h2 className="mt-4 text-lg lg:text-xl font-black">{titulo}</h2>
              <p className="mt-2 text-sm lg:text-base text-zinc-400 leading-6 lg:leading-7">
                {texto}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-10 lg:mt-14 rounded-2xl lg:rounded-3xl border border-red-900/50 bg-gradient-to-br from-red-950/40 to-zinc-900 p-6 lg:p-10 text-center">
          <Trophy className="mx-auto h-10 w-10 text-yellow-400" />
          <h2 className="mt-4 text-xl sm:text-2xl lg:text-3xl font-black">
            Empezá a jugar desde ahora
          </h2>
          <p className="mt-3 text-zinc-400 max-w-xl mx-auto leading-7">
            Mientras lo terminamos, los torneos siguen con premios en cada
            edición. Creá tu cuenta y anotate en el próximo.
          </p>

          <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3">
            <Link
              href="/torneos"
              className="rounded-xl bg-gradient-to-r from-red-600 to-red-500 px-6 py-3 font-bold transition hover:from-red-500 hover:to-red-400 active:scale-[0.98]"
            >
              Ver torneos
            </Link>
            <Link
              href="/register"
              className="rounded-xl border border-zinc-700 bg-black/40 px-6 py-3 font-bold text-zinc-200 transition hover:border-zinc-500 hover:text-white active:scale-[0.98]"
            >
              Crear cuenta gratis
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
