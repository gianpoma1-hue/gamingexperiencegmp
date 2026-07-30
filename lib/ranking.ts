import { supabase } from "./supabase";

// Juegos que se miden con goles (fútbol). Todo lo demás usa
// el sistema genérico de "partidas ganadas/perdidas".
export const JUEGOS_CON_GOLES = ["EA SPORTS FC 26"];

interface RankingParams {
  juego: string;

  jugador1: string;
  jugador2: string;
  ganador: string;

  golesJugador1?: number | null;
  golesJugador2?: number | null;

  esFinal: boolean;
}

export async function actualizarRanking({
  juego,
  jugador1,
  jugador2,
  ganador,
  golesJugador1,
  golesJugador2,
  esFinal,
}: RankingParams) {
  if (JUEGOS_CON_GOLES.includes(juego)) {
    await actualizarRankingConGoles({
      jugador1,
      jugador2,
      ganador,
      golesJugador1: golesJugador1 ?? 0,
      golesJugador2: golesJugador2 ?? 0,
      esFinal,
    });
  } else {
    await actualizarRankingSimple({
      juego,
      jugador1,
      jugador2,
      ganador,
      esFinal,
    });
  }
}

async function actualizarRankingConGoles({
  jugador1,
  jugador2,
  ganador,
  golesJugador1,
  golesJugador2,
  esFinal,
}: {
  jugador1: string;
  jugador2: string;
  ganador: string;
  golesJugador1: number;
  golesJugador2: number;
  esFinal: boolean;
}) {
  const { error: errorJugador1 } = await supabase.rpc(
    "actualizar_estadisticas",
    {
      p_usuario: jugador1,
      p_partidos: 1,
      p_victorias: ganador === jugador1 ? 1 : 0,
      p_derrotas: ganador === jugador1 ? 0 : 1,
      p_goles_favor: golesJugador1,
      p_goles_contra: golesJugador2,
      p_torneos: esFinal && ganador === jugador1 ? 1 : 0,
    }
  );

  if (errorJugador1) {
    throw new Error(
      `No se pudo actualizar el ranking de ${jugador1}: ${errorJugador1.message}`
    );
  }

  const { error: errorJugador2 } = await supabase.rpc(
    "actualizar_estadisticas",
    {
      p_usuario: jugador2,
      p_partidos: 1,
      p_victorias: ganador === jugador2 ? 1 : 0,
      p_derrotas: ganador === jugador2 ? 0 : 1,
      p_goles_favor: golesJugador2,
      p_goles_contra: golesJugador1,
      p_torneos: esFinal && ganador === jugador2 ? 1 : 0,
    }
  );

  if (errorJugador2) {
    throw new Error(
      `No se pudo actualizar el ranking de ${jugador2}: ${errorJugador2.message}`
    );
  }
}

async function actualizarRankingSimple({
  juego,
  jugador1,
  jugador2,
  ganador,
  esFinal,
}: {
  juego: string;
  jugador1: string;
  jugador2: string;
  ganador: string;
  esFinal: boolean;
}) {
  const { error: errorJugador1 } = await supabase.rpc(
    "actualizar_estadisticas_juego",
    {
      p_usuario: jugador1,
      p_juego: juego,
      p_partidos: 1,
      p_victorias: ganador === jugador1 ? 1 : 0,
      p_derrotas: ganador === jugador1 ? 0 : 1,
      p_torneos: esFinal && ganador === jugador1 ? 1 : 0,
    }
  );

  if (errorJugador1) {
    throw new Error(
      `No se pudo actualizar el ranking de ${jugador1}: ${errorJugador1.message}`
    );
  }

  const { error: errorJugador2 } = await supabase.rpc(
    "actualizar_estadisticas_juego",
    {
      p_usuario: jugador2,
      p_juego: juego,
      p_partidos: 1,
      p_victorias: ganador === jugador2 ? 1 : 0,
      p_derrotas: ganador === jugador2 ? 0 : 1,
      p_torneos: esFinal && ganador === jugador2 ? 1 : 0,
    }
  );

  if (errorJugador2) {
    throw new Error(
      `No se pudo actualizar el ranking de ${jugador2}: ${errorJugador2.message}`
    );
  }
}
