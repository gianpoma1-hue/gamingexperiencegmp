-- Seguridad fase 1 (2026-11-04): cierra escrituras públicas y escalada a admin.
-- Rollback: supabase/seguridad_fase1_rollback.sql

-- Helpers (SECURITY INVOKER: no se pueden usar para escalar permisos)
create or replace function public.mi_usuario() returns text
language sql stable set search_path = public as
$$ select usuario from public.usuarios where id = auth.uid() $$;

create or replace function public.soy_admin() returns boolean
language sql stable set search_path = public as
$$ select coalesce((select es_admin from public.usuarios where id = auth.uid()), false) $$;

-- 1. USUARIOS: nadie que no sea admin cambia rol, estadísticas ni identidad
create or replace function public.proteger_columnas_usuarios() returns trigger
language plpgsql set search_path = public as $$
begin
  -- auth.uid() null = SQL Editor / cron / service_role: se permite
  if auth.uid() is not null and not public.soy_admin() then
    if new.es_admin is distinct from old.es_admin
       or new.admin is distinct from old.admin
       or new.id is distinct from old.id
       or new.usuario is distinct from old.usuario
       or new.email is distinct from old.email
       or new.partidos_jugados is distinct from old.partidos_jugados
       or new.victorias is distinct from old.victorias
       or new.derrotas is distinct from old.derrotas
       or new.goles_favor is distinct from old.goles_favor
       or new.goles_contra is distinct from old.goles_contra
       or new.torneos_ganados is distinct from old.torneos_ganados then
      raise exception 'No tenés permiso para modificar esos datos';
    end if;
  end if;
  return new;
end $$;
create trigger proteger_columnas_usuarios before update on public.usuarios
  for each row execute function public.proteger_columnas_usuarios();

drop policy "Usuarios pueden actualizar su propio perfil" on public.usuarios;
create policy "Usuarios pueden actualizar su propio perfil" on public.usuarios
  for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);

drop policy "Usuarios pueden insertar su propio perfil" on public.usuarios;
create policy "Usuarios pueden insertar su propio perfil" on public.usuarios
  for insert to authenticated
  with check (auth.uid() = id and coalesce(es_admin,false) = false and coalesce(admin,false) = false);

-- 2. TORNEOS: fuera las policies públicas de escritura (quedan las de admin y Public Read)
drop policy "Public Insert" on public.torneos;
drop policy "Public Update" on public.torneos;
drop policy "Public Delete" on public.torneos;

-- 3. PARTIDOS: activar RLS; todos leen, solo admins escriben
alter table public.partidos enable row level security;
create policy "Todos ven los partidos" on public.partidos for select to anon, authenticated using (true);
create policy "Solo admins eliminan partidos" on public.partidos for delete to authenticated using (public.soy_admin());

-- 4. INSCRIPCIONES: cada uno se inscribe a sí mismo y como pendiente; borrar solo admins
drop policy "Public Delete" on public.inscripciones;
drop policy "Public Insert" on public.inscripciones;
create policy "Cada usuario se inscribe a si mismo" on public.inscripciones
  for insert to authenticated with check (
    public.soy_admin()
    or (usuario = public.mi_usuario() and estado_pago = 'pendiente' and coalesce(archivado_finanzas,false) = false)
  );

-- 5. MENSAJES DIRECTOS: cada uno ve solo lo suyo; admin ve soporte
drop policy mensajes_directos_select on public.mensajes_directos;
drop policy mensajes_directos_insert on public.mensajes_directos;
drop policy mensajes_directos_update on public.mensajes_directos;
create policy mensajes_directos_select on public.mensajes_directos for select to authenticated using (
  public.soy_admin()
  or remitente = public.mi_usuario()
  or destinatario = public.mi_usuario()
  or conversacion_id = 'soporte::' || public.mi_usuario()
);
create policy mensajes_directos_insert on public.mensajes_directos for insert to authenticated with check (
  remitente = public.mi_usuario() and (coalesce(es_admin,false) = false or public.soy_admin())
);
create policy mensajes_directos_update on public.mensajes_directos for update to authenticated using (
  public.soy_admin()
  or destinatario = public.mi_usuario()
  or conversacion_id = 'soporte::' || public.mi_usuario()
);
-- solo se puede tocar "leido"
revoke update on public.mensajes_directos from anon, authenticated;
grant update (leido) on public.mensajes_directos to authenticated;

-- 6. NOTIFICACIONES: quedan solo las policies "cada usuario lo suyo" (+ insertar a otros)
drop policy notificaciones_select on public.notificaciones;
drop policy notificaciones_update on public.notificaciones;

-- 7. CONFIGURACION: solo admins editan
drop policy configuracion_update on public.configuracion;
create policy configuracion_update on public.configuracion
  for update to authenticated using (public.soy_admin()) with check (public.soy_admin());

-- 8. FUNCIONES: guard de admin en las del ranking; nadie ejecuta las de triggers/cron por API
create or replace function public.actualizar_estadisticas(p_usuario text, p_partidos integer, p_victorias integer, p_derrotas integer, p_goles_favor integer, p_goles_contra integer, p_torneos integer)
returns void language plpgsql security definer set search_path to 'public' as $$
begin
  if auth.uid() is not null and not public.soy_admin() then raise exception 'Solo admins'; end if;
  update usuarios set
    partidos_jugados = partidos_jugados + p_partidos, victorias = victorias + p_victorias,
    derrotas = derrotas + p_derrotas, goles_favor = goles_favor + p_goles_favor,
    goles_contra = goles_contra + p_goles_contra, torneos_ganados = torneos_ganados + p_torneos
  where usuario = p_usuario;
end $$;

create or replace function public.actualizar_estadisticas_juego(p_usuario text, p_juego text, p_partidos integer, p_victorias integer, p_derrotas integer, p_torneos integer)
returns void language plpgsql security definer set search_path to 'public' as $$
begin
  if auth.uid() is not null and not public.soy_admin() then raise exception 'Solo admins'; end if;
  insert into public.estadisticas_juego (usuario, juego, partidos_jugados, victorias, derrotas, torneos_ganados)
  values (p_usuario, p_juego, p_partidos, p_victorias, p_derrotas, p_torneos)
  on conflict (usuario, juego) do update set
    partidos_jugados = estadisticas_juego.partidos_jugados + excluded.partidos_jugados,
    victorias = estadisticas_juego.victorias + excluded.victorias,
    derrotas = estadisticas_juego.derrotas + excluded.derrotas,
    torneos_ganados = estadisticas_juego.torneos_ganados + excluded.torneos_ganados;
end $$;

revoke execute on function public.actualizar_estadisticas(text,int,int,int,int,int,int) from public, anon;
revoke execute on function public.actualizar_estadisticas_juego(text,text,int,int,int,int) from public, anon;
revoke execute on function public.avisar_torneos_por_empezar() from public, anon, authenticated;
revoke execute on function public.notificar_nuevo_mensaje() from public, anon, authenticated;
revoke execute on function public.notificar_nuevo_torneo() from public, anon, authenticated;
revoke execute on function public.notificar_torneo_iniciado() from public, anon, authenticated;
