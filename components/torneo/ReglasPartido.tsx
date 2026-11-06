"use client";

import { AlertTriangle } from "lucide-react";

import type { ReglasResuelta } from "@/lib/reglas";

type Props = {
  reglas: ReglasResuelta;
};

type SeccionRegla = {
  titulo: string;
  // Texto introductorio de la sección (opcional)
  intro?: string;
  // Lista con viñetas (opcional)
  items?: string[];
  // Lista numerada de pasos (opcional)
  pasos?: string[];
  // Texto de cierre de la sección (opcional)
  cierre?: string;
};

// Reglamento oficial de Counter-Strike 2.
// **texto** = negrita, y las direcciones http(s) se vuelven enlaces.
const REGLAS_CS2: SeccionRegla[] = [
  {
    titulo: "1. Formato del torneo",
    items: [
      "**Modalidad:** 5 vs. 5, eliminación directa.",
      "**Semifinales:** al mejor de 3 mapas (BO3).",
      "**Final:** al mejor de 3 mapas (BO3).",
      "**Mapas:** se definen mediante veto. Los propios equipos vetan los mapas para determinar cuáles se jugarán.",
      "El segundo puesto recibirá una inscripción gratuita para un futuro torneo de Gaming Experience GMP.",
    ],
  },
  {
    titulo: "2. Registro obligatorio en XPLAY.GG",
    intro:
      "Todos los jugadores deberán tener Steam, CS2 instalado y una cuenta de xplay.gg antes del partido.",
    pasos: [
      "Ingresá a https://xplay.gg/",
      "Registrate o iniciá sesión mediante Steam y completá la autorización solicitada.",
      "Cuando recibas el enlace de la sala, ingresá y seguí las indicaciones para conectarte a CS2.",
    ],
    cierre:
      "Es responsabilidad de cada jugador tener todo preparado antes del horario del encuentro. No compartas tu contraseña ni tus códigos de seguridad.",
  },
  {
    titulo: "3. Creación e inicio de las partidas",
    items: [
      "La organización sorteará un capitán responsable de crear la sala en xplay.gg y enviar las invitaciones a los jugadores.",
      "Los 10 jugadores deberán estar presentes antes de iniciar.",
      "Ninguna partida podrá comenzar sin la autorización de la organización.",
      "La organización podrá supervisar los encuentros cuando la plataforma lo permita.",
    ],
  },
  {
    titulo: "4. Horarios y ausencias",
    intro:
      "Se establece una tolerancia máxima de **10 minutos** desde el horario oficial. Si un jugador no se presenta, la organización evaluará cómo proceder y podrá aplicar las sanciones correspondientes.",
  },
  {
    titulo: "5. Juego limpio",
    intro:
      "Está prohibido utilizar cheats, hacks, ventajas ilegales, suplantar jugadores, manipular resultados o faltar el respeto a otros participantes.",
    cierre:
      "El incumplimiento podrá ocasionar la pérdida del encuentro, la descalificación del jugador o del equipo, o la suspensión de futuros torneos.",
  },
  {
    titulo: "6. Desconexiones y problemas técnicos",
    intro:
      "Cualquier problema técnico o desconexión deberá comunicarse inmediatamente a la organización. No se podrá pausar, reiniciar o repetir una partida sin autorización. Los problemas de conexión no garantizan la repetición del encuentro.",
  },
  {
    titulo: "7. Reporte obligatorio de resultados",
    intro:
      "Al finalizar cada encuentro, se deberá reportar el resultado en la página web oficial de Gaming Experience GMP, dentro de la llave de grupos correspondiente al torneo.",
    cierre:
      "Los jugadores deberán conservar capturas del resultado como comprobante si la organización las solicita. Falsear resultados o presentar pruebas manipuladas podrá causar la descalificación.",
  },
  {
    titulo: "8. Reclamos y decisiones",
    intro:
      "Los reclamos deberán presentarse a la organización con una explicación clara y pruebas cuando sea posible. Gaming Experience GMP evaluará cada situación y comunicará su decisión, procurando garantizar una competencia justa.",
  },
  {
    titulo: "9. Aceptación obligatoria",
    intro:
      "Al inscribirse, cada jugador declara haber leído y aceptado este reglamento, y se compromete a cumplirlo durante todo el torneo.",
    cierre:
      "**Si no estás de acuerdo con estas reglas, no te inscribas ni participes.**",
  },
];

// Convierte **negrita** y enlaces dentro de un texto en elementos React.
function renderTexto(texto: string) {
  return texto
    .split(/(\*\*[^*]+\*\*|https?:\/\/[^\s]+)/g)
    .filter(Boolean)
    .map((parte, i) => {
      if (parte.startsWith("**") && parte.endsWith("**")) {
        return (
          <span key={i} className="font-semibold text-white">
            {parte.slice(2, -2)}
          </span>
        );
      }
      if (/^https?:\/\//.test(parte)) {
        return (
          <a
            key={i}
            href={parte}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-yellow-400 underline underline-offset-2 hover:text-yellow-300"
          >
            {parte}
          </a>
        );
      }
      return <span key={i}>{parte}</span>;
    });
}

// Reglamento de CS2 para el formato de 6 equipos (2 zonas de 3 + semifinales y final).
// Solo cambia la sección 1: el resto es igual al reglamento de eliminación directa.
const REGLAS_CS2_ZONAS: SeccionRegla[] = [
  {
    titulo: "1. Formato del torneo (6 equipos)",
    items: [
      "**Modalidad:** 5 vs. 5, 6 equipos.",
      "**Fase de zonas:** 2 zonas de 3 equipos (Zona A y Zona B), armadas por sorteo. Cada equipo juega 2 partidos a BO1 contra los otros 2 equipos de su zona.",
      "**Clasificación:** los 2 primeros de cada zona clasifican a las semifinales.",
      "**Posiciones:** se ordenan por 1) partidos ganados, 2) mayor diferencia de rondas (rondas a favor menos rondas en contra) y 3) más rondas ganadas en total. Si todavía hay empate, se juega una partida de desempate.",
      "**Semifinales:** 1° Zona A vs 2° Zona B y 1° Zona B vs 2° Zona A, a BO1 (un solo mapa).",
      "**Final:** al mejor de 3 mapas (BO3).",
      "**Mapas:** se definen mediante veto. Los propios equipos vetan los mapas para determinar cuáles se jugarán.",
      "El segundo puesto recibirá una inscripción gratuita para un futuro torneo de Gaming Experience GMP.",
    ],
  },
  ...REGLAS_CS2.slice(1),
];

export default function ReglasPartido({ reglas }: Props) {
  const esTrucoBlyts = reglas === "truco";
  const esFC26 = reglas === "fc";
  const esCS2 = reglas === "cs2-eliminacion" || reglas === "cs2-zonas";
  const seccionesCS2 = reglas === "cs2-zonas" ? REGLAS_CS2_ZONAS : REGLAS_CS2;

  if (!esTrucoBlyts && !esFC26 && !esCS2) return null;

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
                  EA SPORTS FC.
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
      {esCS2 && (
        <div className="space-y-6 text-zinc-300 leading-7">
          <p className="font-semibold text-white">
            Leer y aceptar estas reglas es obligatorio para participar en el
            torneo.
          </p>

          {seccionesCS2.map((seccion) => (
            <div key={seccion.titulo}>
              <p className="text-sm font-bold text-yellow-500 mb-3">
                {seccion.titulo}
              </p>

              {seccion.intro && <p>{renderTexto(seccion.intro)}</p>}

              {seccion.items && (
                <ul className="space-y-2 list-disc pl-5 marker:text-yellow-500/70">
                  {seccion.items.map((item, i) => (
                    <li key={i}>{renderTexto(item)}</li>
                  ))}
                </ul>
              )}

              {seccion.pasos && (
                <ol
                  className={`space-y-2 list-decimal pl-5 marker:font-bold marker:text-yellow-500 ${
                    seccion.intro ? "mt-3" : ""
                  }`}
                >
                  {seccion.pasos.map((paso, i) => (
                    <li key={i}>{renderTexto(paso)}</li>
                  ))}
                </ol>
              )}

              {seccion.cierre && (
                <p className="mt-3">{renderTexto(seccion.cierre)}</p>
              )}
            </div>
          ))}

          <p className="text-sm text-zinc-500 italic">
            Gaming Experience GMP — Competencia, respeto y juego limpio.
          </p>
        </div>
      )}
    </div>
  );
}
