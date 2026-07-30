import { supabase } from "./supabase";
import { actualizarRanking } from "./ranking";

export interface ResultadoPartido {
  partidoId: string;
  torneoId: string;
  juego?: string;

  // Modo "con goles" (ej: EA SPORTS FC 26)
  golesJugador1?: number | null;
  golesJugador2?: number | null;
  penalesJugador1?: number | null;
  penalesJugador2?: number | null;

  // Modo "ganador directo" (ej: Truco Blyts, y cualquier juego sin goles)
  ganadorDirecto?: string;
}

export async function guardarResultado({
  partidoId,
  torneoId,
  juego,
  golesJugador1,
  golesJugador2,
  penalesJugador1,
  penalesJugador2,
  ganadorDirecto,
}: ResultadoPartido) {
  const { data: partido, error } = await supabase
    .from("partidos")
    .select("*")
    .eq("id", partidoId)
    .single();

  if (error || !partido) {
    throw new Error("No se encontró el partido.");
  }

  let ganador: string;
  let ganadorCapitan: string | null;

  let golesFinal1: number | null = null;
  let golesFinal2: number | null = null;
  let penalesFinal1: number | null = null;
  let penalesFinal2: number | null = null;

  if (ganadorDirecto) {
    // --- Modo sin goles: el admin elige directamente quién ganó ---
    if (ganadorDirecto !== partido.jugador1 && ganadorDirecto !== partido.jugador2) {
      throw new Error("El ganador elegido no pertenece a este partido.");
    }

    ganador = ganadorDirecto;
    ganadorCapitan =
      ganador === partido.jugador1
        ? partido.capitan1 ?? null
        : partido.capitan2 ?? null;
  } else {
    // --- Modo con goles (y penales si empatan) ---
    if (golesJugador1 == null || golesJugador2 == null) {
      throw new Error("Completá ambos resultados.");
    }

    golesFinal1 = golesJugador1;
    golesFinal2 = golesJugador2;

    if (golesJugador1 > golesJugador2) {
      ganador = partido.jugador1;
      ganadorCapitan = partido.capitan1 ?? null;
    } else if (golesJugador2 > golesJugador1) {
      ganador = partido.jugador2;
      ganadorCapitan = partido.capitan2 ?? null;
    } else {
      if (penalesJugador1 == null || penalesJugador2 == null) {
        throw new Error("Completá los penales.");
      }

      if (penalesJugador1 === penalesJugador2) {
        throw new Error("Los penales no pueden empatar.");
      }

      penalesFinal1 = penalesJugador1;
      penalesFinal2 = penalesJugador2;

      if (penalesJugador1 > penalesJugador2) {
        ganador = partido.jugador1;
        ganadorCapitan = partido.capitan1 ?? null;
      } else {
        ganador = partido.jugador2;
        ganadorCapitan = partido.capitan2 ?? null;
      }
    }
  }

  // Guardar resultado
  const { error: updateError } = await supabase
    .from("partidos")
    .update({
      goles_jugador1: golesFinal1,
      goles_jugador2: golesFinal2,
      penales_jugador1: penalesFinal1,
      penales_jugador2: penalesFinal2,
      ganador,
      estado: "Finalizado",
    })
    .eq("id", partidoId);

  if (updateError) throw updateError;

  // Buscar última ronda
  const { data: ultimaRondaData } = await supabase
    .from("partidos")
    .select("ronda")
    .eq("torneo_id", torneoId)
    .order("ronda", { ascending: false })
    .limit(1)
    .single();

  const ultimaRonda = ultimaRondaData?.ronda ?? 1;
  const esFinal = partido.ronda === ultimaRonda;

  // El ranking individual solo se actualiza para torneos 1 vs 1.
  // Los torneos de equipos (ej: Truco Blyts 2vs2) todavía no tienen ranking
  // propio ("Ranking en Equipo" sigue en "Próximamente") y no deben sumar
  // acá.
  const { data: torneoData } = await supabase
    .from("torneos")
    .select("modalidad, juego")
    .eq("id", torneoId)
    .single();

  if (torneoData?.modalidad !== "equipo") {
    await actualizarRanking({
      juego: juego ?? torneoData?.juego ?? "",
      jugador1: partido.jugador1,
      jugador2: partido.jugador2,
      ganador,
      golesJugador1: golesFinal1,
      golesJugador2: golesFinal2,
      esFinal,
    });
  }

  // Si era la final, finalizar torneo
  if (esFinal) {
    const { error: torneoError } = await supabase
      .from("torneos")
      .update({
        estado: "Finalizado",
        campeon: ganador,
      })
      .eq("id", torneoId);

    if (torneoError) throw torneoError;

    return ganador;
  }

  // Avanzar ganador
  const siguienteRonda = partido.ronda + 1;
  const siguienteNumero = Math.ceil(partido.numero_partido / 2);

  const { data: siguientePartido } = await supabase
    .from("partidos")
    .select("*")
    .eq("torneo_id", torneoId)
    .eq("ronda", siguienteRonda)
    .eq("numero_partido", siguienteNumero)
    .maybeSingle();

  if (siguientePartido) {
    const update: {
      jugador1?: string;
      jugador2?: string;
      capitan1?: string | null;
      capitan2?: string | null;
    } = {};

    if (partido.numero_partido % 2 === 1) {
      update.jugador1 = ganador;
      update.capitan1 = ganadorCapitan;
    } else {
      update.jugador2 = ganador;
      update.capitan2 = ganadorCapitan;
    }

    const { error: siguienteError } = await supabase
      .from("partidos")
      .update(update)
      .eq("id", siguientePartido.id);

    if (siguienteError) throw siguienteError;
  }

  return ganador;
}
