// Formatos de fecha y hora de los torneos.
// La fecha viene de la base como "2026-11-06" y la hora como "21:30:00".

// "2026-11-06" -> "06/11/26"
export function fechaTorneo(fecha?: string | null) {
  if (!fecha) return "A definir";
  const [anio, mes, dia] = fecha.slice(0, 10).split("-");
  if (!anio || !mes || !dia) return fecha;
  return `${dia}/${mes}/${anio.slice(2)}`;
}

// "21:30:00" -> "21:30hs"
export function horaTorneo(hora?: string | null) {
  if (!hora) return null;
  const hhmm = hora.match(/^(\d{1,2}):(\d{2})/);
  return hhmm ? `${hhmm[1].padStart(2, "0")}:${hhmm[2]}hs` : hora;
}
