-- Seguridad fase 3 — paso A (2026-11-04). SOLO AGREGA funciones: no cambia ni cierra nada.
-- Se corre ANTES de subir el código nuevo. El cierre está en seguridad_fase3b.sql.

-- Cantidad de inscriptos de un torneo (para cupos), sin exponer los datos de cada inscripción.
create or replace function public.contar_inscriptos(p_torneo uuid) returns integer
language sql stable security definer set search_path = public as
$$ select count(*)::int from public.inscripciones where torneo_id = p_torneo $$;

-- Escudos de los equipos para la llave: solo usuario, equipo y escudo.
create or replace function public.escudos_torneo(p_torneo uuid)
returns table (usuario text, equipo text, escudo_url text)
language sql stable security definer set search_path = public as
$$ select i.usuario, i.equipo, i.escudo_url from public.inscripciones i where i.torneo_id = p_torneo $$;

-- Lista completa de usuarios (con email) solo para admins.
create or replace function public.admin_listar_usuarios() returns setof public.usuarios
language plpgsql stable security definer set search_path = public as $$
begin
  if not public.soy_admin() then
    raise exception 'Solo admins';
  end if;
  return query select * from public.usuarios order by nombre;
end $$;

revoke execute on function public.contar_inscriptos(uuid) from public;
revoke execute on function public.escudos_torneo(uuid) from public;
revoke execute on function public.admin_listar_usuarios() from public, anon;
grant execute on function public.contar_inscriptos(uuid) to anon, authenticated;
grant execute on function public.escudos_torneo(uuid) to anon, authenticated;
grant execute on function public.admin_listar_usuarios() to authenticated;
