-- Deshace checkin.sql (borra las funciones y las columnas nuevas).
drop function if exists public.hacer_checkin(uuid);
drop function if exists public.mi_checkin(uuid);
alter table public.partidos drop column if exists wo;
alter table public.inscripciones drop column if exists checkin_at;
