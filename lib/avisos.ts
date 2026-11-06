// Avisos dentro de la página (reemplazan al alert() del navegador).
// Se puede llamar desde cualquier lado, también desde archivos de lib/:
//   avisar("Torneo creado correctamente.")
// El color se deduce del texto; se puede forzar con el segundo parámetro.
// Los muestra <Avisos /> (montado una sola vez en app/layout.tsx).

export type TipoAviso = "exito" | "error" | "info";

export type Aviso = { id: number; texto: string; tipo: TipoAviso };

let avisos: Aviso[] = [];
let siguienteId = 1;
const oyentes = new Set<() => void>();

function emitir() {
  oyentes.forEach((fn) => fn());
}

function deducirTipo(texto: string): TipoAviso {
  const t = texto.toLowerCase();
  if (/^no |error|venció|no tenés|no se |falta|inválid/.test(t)) return "error";
  if (/correctamente|actualizad|guardad|eliminad|reiniciad|creado|reseteadas|^listo|✅|enviad/.test(t))
    return "exito";
  return "info";
}

export function avisar(texto: unknown, tipo?: TipoAviso) {
  const mensaje = String(texto ?? "");
  const aviso: Aviso = { id: siguienteId++, texto: mensaje, tipo: tipo ?? deducirTipo(mensaje) };

  // Máximo 4 a la vista: si se juntan, se va el más viejo
  avisos = [...avisos, aviso].slice(-4);
  emitir();

  // Más tiempo para los textos largos
  const duracion = Math.min(9000, 3500 + mensaje.length * 40);
  setTimeout(() => cerrarAviso(aviso.id), duracion);
}

export function cerrarAviso(id: number) {
  const antes = avisos.length;
  avisos = avisos.filter((a) => a.id !== id);
  if (avisos.length !== antes) emitir();
}

export function suscribirAvisos(fn: () => void) {
  oyentes.add(fn);
  return () => {
    oyentes.delete(fn);
  };
}

export function leerAvisos() {
  return avisos;
}

const SIN_AVISOS: Aviso[] = [];
export function leerAvisosServidor() {
  return SIN_AVISOS;
}
