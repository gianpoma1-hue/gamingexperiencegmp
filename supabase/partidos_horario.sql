-- Horario por partido (2026-11-06): día y hora de cada partido, cargado por el admin.
-- Solo AGREGA una columna vacía: no cambia ningún dato ni permiso.
-- Las reglas de partidos ya la cubren (todos leen, solo admins escriben).

alter table public.partidos add column if not exists horario timestamptz;

-- Rollback (solo si hiciera falta):
-- alter table public.partidos drop column if exists horario;
