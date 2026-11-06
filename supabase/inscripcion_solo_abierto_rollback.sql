-- Deshace inscripcion_solo_abierto.sql (vuelve a como estaba antes).
drop trigger if exists validar_inscripcion on public.inscripciones;
drop function if exists public.validar_inscripcion();
