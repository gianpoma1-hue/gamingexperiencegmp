import { esFormatoZonas } from "./zonas";

// Reglamento que se muestra en la llave de cada torneo.
// "auto" = se elige solo según el juego y el formato (ver resolverReglas).
export type ReglasId =
  | "auto"
  | "cs2-eliminacion"
  | "cs2-zonas"
  | "fc"
  | "truco"
  | "ninguna";

export type ReglasResuelta = Exclude<ReglasId, "auto">;

export const OPCIONES_REGLAS: { id: ReglasId; label: string }[] = [
  { id: "auto", label: "Automática (según el juego y el formato)" },
  { id: "cs2-eliminacion", label: "Counter-Strike 2 · Eliminación directa" },
  {
    id: "cs2-zonas",
    label: "Counter-Strike 2 · 2 zonas de 3 + semifinales y final (6 equipos)",
  },
  { id: "fc", label: "EA SPORTS FC (reglas de partido)" },
  { id: "truco", label: "Truco Blyts" },
  { id: "ninguna", label: "Sin reglas especiales" },
];

export function etiquetaReglas(id: ReglasResuelta) {
  return OPCIONES_REGLAS.find((o) => o.id === id)?.label ?? id;
}

// Devuelve qué reglamento corresponde mostrar.
// Si el admin eligió uno en el torneo, se respeta. Si dejó "Automática":
//   - Counter-Strike 2 con 6 equipos  -> reglas de zonas
//   - Counter-Strike 2 (otra cantidad) -> eliminación directa
//   - EA SPORTS FC 26 / 27             -> reglas de FC
//   - Truco Blyts                      -> reglas de Truco
export function resolverReglas(
  juego: string,
  jugadoresMax?: number | null,
  reglas?: string | null
): ReglasResuelta {
  if (reglas && reglas !== "auto") {
    const valida = OPCIONES_REGLAS.some((o) => o.id === reglas);
    if (valida) return reglas as ReglasResuelta;
  }

  if (juego === "Counter-Strike 2") {
    return esFormatoZonas(jugadoresMax) ? "cs2-zonas" : "cs2-eliminacion";
  }
  if (juego === "EA SPORTS FC 26" || juego === "EA SPORTS FC 27") return "fc";
  if (juego === "Truco Blyts") return "truco";

  return "ninguna";
}
