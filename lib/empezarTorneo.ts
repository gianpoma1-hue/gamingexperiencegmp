import { supabase } from "./supabase";

// Arranca un torneo: genera la llave (o las 2 zonas en el formato de 6) y lo pasa a "En curso".
// Pide confirmación y avisa con alert(). Devuelve true si el torneo se inició.
// La usan Admin › Dashboard y Admin › Torneos.
export async function empezarTorneo(torneoId: string): Promise<boolean> {
    // Buscar inscriptos primero para poder mostrar el conteo real
    // en el aviso de confirmación.
    const { data: inscriptosPrevios, error: errorPrevio } = await supabase
      .from("inscripciones")
      .select("estado_pago")
      .eq("torneo_id", torneoId);

    if (errorPrevio) {
      alert(errorPrevio.message);
      return false;
    }

    const confirmados =
      inscriptosPrevios?.filter((i) => i.estado_pago === "confirmado")
        .length ?? 0;

    const confirmar = confirm(
      `¿Querés comenzar este torneo?\n\nJugadores con pago confirmado: ${confirmados}\n\nEsta acción genera la llave y no se puede deshacer desde la web (habría que pedirle ayuda a Claude para revertirlo a mano en la base de datos).`
    );

    if (!confirmar) return false;

    // Evitar iniciarlo dos veces
    const { data: existentes } = await supabase
      .from("partidos")
      .select("id")
      .eq("torneo_id", torneoId)
      .limit(1);

    if (existentes && existentes.length > 0) {
      alert("Este torneo ya fue iniciado.");
      return false;
    }

    // Saber si el torneo es individual o por equipos
    const { data: torneoData } = await supabase
      .from("torneos")
      .select("modalidad, jugadores_max")
      .eq("id", torneoId)
      .single();

    const esPorEquipos = torneoData?.modalidad === "equipo";

    // Buscar inscriptos
    const { data: inscriptos, error } = await supabase
      .from("inscripciones")
      .select("*")
      .eq("torneo_id", torneoId);

    if (error) {
      alert(error.message);
      return false;
    }

    if (!inscriptos || inscriptos.length < 2) {
      alert("No hay suficientes jugadores.");
      return false;
    }
    const pagosSinConfirmar = inscriptos.filter(
  (i) => i.estado_pago !== "confirmado"
);

if (pagosSinConfirmar.length > 0) {
  alert(
    "No podés iniciar el torneo hasta que TODOS los pagos estén confirmados."
  );
  return false;
}

  // Mezclar jugadores
const jugadores = [...inscriptos].sort(
  () => Math.random() - 0.5
);

// -------------------------
// FORMATO DE 6: 2 zonas de 3 + semifinales + final
// -------------------------
if (torneoData?.jugadores_max === 6) {
  if (jugadores.length !== 6) {
    alert(
      "El formato de 2 zonas de 3 necesita exactamente 6 inscriptos. Ahora hay " +
        jugadores.length +
        "."
    );
    return false;
  }

  const nombre = (j: (typeof jugadores)[number]) =>
    esPorEquipos ? j.equipo ?? j.usuario : j.usuario;

  const crear = (
    ronda: number,
    numero: number,
    a?: (typeof jugadores)[number],
    b?: (typeof jugadores)[number]
  ) => ({
    torneo_id: torneoId,
    ronda,
    numero_partido: numero,
    jugador1: a ? nombre(a) : null,
    jugador2: b ? nombre(b) : null,
    capitan1: a?.usuario ?? null,
    capitan2: b?.usuario ?? null,
    estado: "Pendiente",
  });

  const zonaA = jugadores.slice(0, 3);
  const zonaB = jugadores.slice(3, 6);

  // Partidos 1-3 = Zona A, 4-6 = Zona B (fecha 1, 2 y 3 de cada zona)
  const partidosZona = [
    crear(1, 1, zonaA[0], zonaA[1]),
    crear(1, 2, zonaA[0], zonaA[2]),
    crear(1, 3, zonaA[1], zonaA[2]),
    crear(1, 4, zonaB[0], zonaB[1]),
    crear(1, 5, zonaB[0], zonaB[2]),
    crear(1, 6, zonaB[1], zonaB[2]),
    // Semifinales y final: se completan solas cuando terminan las zonas
    crear(2, 1),
    crear(2, 2),
    crear(3, 1),
  ];

  const { error: errorZonas } = await supabase
    .from("partidos")
    .insert(partidosZona);

  if (errorZonas) {
    alert(errorZonas.message);
    return false;
  }

  await supabase
    .from("torneos")
    .update({ estado: "En curso" })
    .eq("id", torneoId);

  alert("¡Torneo iniciado! Se armaron las 2 zonas por sorteo.");
  return true;
}

const partidos = [];

// -------------------------
// RONDA 1
// -------------------------

for (let i = 0; i < jugadores.length; i += 2) {
  const nombreEntrante = (j: (typeof jugadores)[number] | undefined) =>
    !j ? null : esPorEquipos ? j.equipo ?? j.usuario : j.usuario;

  const capitanEntrante = (j: (typeof jugadores)[number] | undefined) =>
    j?.usuario ?? null;

  partidos.push({
    torneo_id: torneoId,
    ronda: 1,
    numero_partido: i / 2 + 1,
    jugador1: nombreEntrante(jugadores[i]),
    jugador2: nombreEntrante(jugadores[i + 1]),
    capitan1: capitanEntrante(jugadores[i]),
    capitan2: capitanEntrante(jugadores[i + 1]),
    estado: "Pendiente",
  });
}

// -------------------------
// RESTO DE RONDAS
// -------------------------

let partidosRonda = jugadores.length / 2;
let ronda = 2;

while (partidosRonda > 1) {
  partidosRonda /= 2;

  for (let i = 1; i <= partidosRonda; i++) {
    partidos.push({
      torneo_id: torneoId,
      ronda,
      numero_partido: i,
      jugador1: null,
      jugador2: null,
      capitan1: null,
      capitan2: null,
      estado: "Pendiente",
    });
  }

  ronda++;
}

    const { error: errorInsert } = await supabase
      .from("partidos")
      .insert(partidos);

    if (errorInsert) {
      alert(errorInsert.message);
      return false;
    }

    await supabase
      .from("torneos")
      .update({
        estado: "En curso",
      })
      .eq("id", torneoId);

    alert("¡Torneo iniciado correctamente!");
    return true;
}
