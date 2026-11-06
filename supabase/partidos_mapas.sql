-- Resultado mapa por mapa para partidos al mejor de 3 (final de CS2) — 2026-11-05.
-- Solo AGREGA una columna vacía: no cambia ningún dato ni permiso.
-- Formato: [[13,9],[8,13],[13,11]] = rondas de jugador1 y jugador2 en cada mapa jugado.
-- goles_jugador1 / goles_jugador2 siguen guardando los mapas ganados (2 y 1).
-- Las reglas de seguridad de partidos ya cubren la columna (todos leen, solo admins escriben).

alter table public.partidos add column if not exists mapas jsonb;

-- Rollback (solo si hiciera falta):
-- alter table public.partidos drop column if exists mapas;
