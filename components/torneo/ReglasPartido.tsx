"use client";

import { AlertTriangle } from "lucide-react";

type Props = {
  esTrucoBlyts: boolean;
  esFC26: boolean;
};

export default function ReglasPartido({ esTrucoBlyts, esFC26 }: Props) {
  if (!esTrucoBlyts && !esFC26) return null;

  return (
    <div className="rounded-2xl border border-yellow-500/40 bg-yellow-500/[0.04] px-5 sm:px-8 py-6">
      <div className="flex items-center gap-3 mb-5">
        <AlertTriangle className="text-yellow-500 shrink-0" size={22} />
        <h2 className="text-lg font-bold text-yellow-500">
          Importante: lectura obligatoria
        </h2>
      </div>

      {esTrucoBlyts && (
        <ol className="space-y-3 text-zinc-300 leading-7">
          <li className="flex gap-3">
            <span className="text-yellow-500 font-bold">1.</span>
            <span>
              Contactate con tu rival desde el{" "}
              <span className="font-semibold text-white">chat del partido</span>
              , intercambien su ID de Truco Blyts y agréguense.
            </span>
          </li>

          <li className="flex gap-3">
            <span className="text-yellow-500 font-bold">2.</span>
            <span>
              Una vez confirmada la ronda, ambos jugadores dispondrán de un
              máximo de{" "}
              <span className="font-semibold text-white">10 minutos</span> para
              iniciar la partida. Si un jugador no se presenta dentro de ese
              plazo, perderá el encuentro.
            </span>
          </li>

          <li className="flex gap-3">
            <span className="text-yellow-500 font-bold">3.</span>
            <span>
              El jugador que cree la partida deberá configurarla a{" "}
              <span className="font-semibold text-white">
                30 puntos y sin flor
              </span>
              .
            </span>
          </li>

          <li className="flex gap-3">
            <span className="text-yellow-500 font-bold">4.</span>
            <span>
              Al finalizar el partido, ambos jugadores deberán reportar el{" "}
              <span className="font-semibold text-white">mismo resultado</span>.
              Si hay diferencias, el ganador deberá presentar una captura del
              resultado final.
            </span>
          </li>

          <li className="flex gap-3">
            <span className="text-yellow-500 font-bold">5.</span>
            <span>
              Si un jugador se desconecta, la partida deberá continuar
              respetando el marcador. Si el rival no se reconecta dentro de los{" "}
              <span className="font-semibold text-white">5 minutos</span>, el
              jugador que permaneció en la partida será declarado ganador.
            </span>
          </li>
        </ol>
      )}

      {esFC26 && (
        <div className="space-y-6 text-zinc-300 leading-7">
          <div>
            <p className="text-sm font-bold text-yellow-500 mb-3">
              Antes de jugar
            </p>

            <ul className="space-y-3">
              <li className="flex gap-3">
                <span>💬</span>
                <span>
                  Utilizá el{" "}
                  <span className="font-semibold text-white">
                    chat del partido
                  </span>{" "}
                  con tu rival para coordinar el horario e intercambiar el ID de
                  EA SPORTS FC 26.
                </span>
              </li>

              <li className="flex gap-3">
                <span>🎮</span>
                <span>
                  El partido deberá jugarse en el modo{" "}
                  <span className="font-semibold text-white">
                    &quot;Amistoso Online&quot; (Online Friendlies)
                  </span>
                  , agregando previamente a tu rival como amigo.
                </span>
              </li>

              <li className="flex gap-3">
                <span>⚽</span>
                <div>
                  <span>
                    El jugador que cree la partida deberá configurar
                    obligatoriamente:
                  </span>

                  <ul className="mt-2 ml-1 space-y-1 list-disc list-inside text-zinc-300">
                    <li>Duración de cada tiempo: 6 minutos.</li>
                    <li>Velocidad de juego: Normal.</li>
                    <li>Lesiones: Desactivadas.</li>
                    <li>Mano: Desactivada.</li>
                    <li>Plantillas: Actualizadas.</li>
                  </ul>
                </div>
              </li>

              <li className="flex gap-3">
                <span>⏱️</span>
                <span>
                  Si el partido termina empatado, deberá disputarse la prórroga.
                  Si el empate persiste al finalizar la prórroga, el ganador se
                  definirá mediante la tanda de penales.
                </span>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-sm font-bold text-yellow-500 mb-3">
              Al finalizar el partido
            </p>

            <ul className="space-y-3">
              <li className="flex gap-3">
                <span>📝</span>
                <span>
                  Ambos jugadores deberán ingresar al apartado{" "}
                  <span className="font-semibold text-white">
                    &quot;Reportar resultado&quot;
                  </span>{" "}
                  y cargar exactamente el mismo resultado del partido.
                </span>
              </li>

              <li className="flex gap-3">
                <span>📸</span>
                <span>
                  Si los resultados informados son diferentes o existe algún
                  inconveniente, el ganador deberá presentar una captura de
                  pantalla del resultado final del partido como comprobante.
                </span>
              </li>

              <li className="flex gap-3">
                <span>🔌</span>
                <span>
                  Si a alguno de los jugadores se le corta la conexión durante
                  el partido, este debe continuar respetando el marcador en el
                  que quedó al momento del corte (se recomienda sacar una
                  captura de pantalla de ese marcador como respaldo). Al
                  finalizar, ambos jugadores deben reportar el resultado
                  adjuntando sus capturas correspondientes. Si el rival abandona
                  el partido y pasan más de{" "}
                  <span className="font-semibold text-white">5 minutos</span>{" "}
                  sin que se reconecte, el jugador que permaneció en el partido
                  será declarado ganador.
                </span>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
