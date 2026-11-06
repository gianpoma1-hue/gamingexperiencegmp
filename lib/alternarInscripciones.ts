import { avisar } from "@/lib/avisos";
import { supabase } from "@/lib/supabase";

// Abierto <-> Cerrado. Un torneo cerrado no aparece en la home
// y no acepta inscripciones nuevas (los ya inscriptos siguen adentro).
export async function alternarInscripciones(torneo: {
  id: string;
  nombre: string;
  estado: string;
}) {
  const cerrar = torneo.estado === "Abierto";

  const ok = confirm(
    cerrar
      ? `¿Cerrar las inscripciones de "${torneo.nombre}"? Nadie más se va a poder anotar.`
      : `¿Reabrir las inscripciones de "${torneo.nombre}"?`
  );
  if (!ok) return false;

  const { error } = await supabase
    .from("torneos")
    .update({ estado: cerrar ? "Cerrado" : "Abierto" })
    .eq("id", torneo.id)
    .eq("estado", torneo.estado);

  if (error) {
    avisar("No se pudo cambiar el estado: " + error.message);
    return false;
  }

  return true;
}
