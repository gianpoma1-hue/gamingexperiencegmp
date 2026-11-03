-- Rollback de supabase/seguridad_fase1.sql: deja todo como estaba el 2026-11-04.
-- ATENCIÓN: vuelve a abrir los agujeros de seguridad. Usar solo si algo se rompió.

-- 8. Funciones
create or replace function public.actualizar_estadisticas(p_usuario text, p_partidos integer, p_victorias integer, p_derrotas integer, p_goles_favor integer, p_goles_contra integer, p_torneos integer)
returns void language plpgsql security definer set search_path to 'public' as $$
begin
  update usuarios
  set
    partidos_jugados = partidos_jugados + p_partidos,
    victorias = victorias + p_victorias,
    derrotas = derrotas + p_derrotas,
    goles_favor = goles_favor + p_goles_favor,
    goles_contra = goles_contra + p_goles_contra,
    torneos_ganados = torneos_ganados + p_torneos
  where usuario = p_usuario;
end;
$$;

create or replace function public.actualizar_estadisticas_juego(p_usuario text, p_juego text, p_partidos integer, p_victorias integer, p_derrotas integer, p_torneos integer)
returns void language plpgsql security definer as $$
begin
  insert into public.estadisticas_juego
    (usuario, juego, partidos_jugados, victorias, derrotas, torneos_ganados)
  values
    (p_usuario, p_juego, p_partidos, p_victorias, p_derrotas, p_torneos)
  on conflict (usuario, juego)
  do update set
    partidos_jugados = estadisticas_juego.partidos_jugados + excluded.partidos_jugados,
    victorias = estadisticas_juego.victorias + excluded.victorias,
    derrotas = estadisticas_juego.derrotas + excluded.derrotas,
    torneos_ganados = estadisticas_juego.torneos_ganados + excluded.torneos_ganados;
end;
$$;

grant execute on function public.actualizar_estadisticas(text,int,int,int,int,int,int) to public, anon, authenticated;
grant execute on function public.actualizar_estadisticas_juego(text,text,int,int,int,int) to public, anon, authenticated;
grant execute on function public.avisar_torneos_por_empezar() to public, anon, authenticated;
grant execute on function public.notificar_nuevo_mensaje() to public, anon, authenticated;
grant execute on function public.notificar_nuevo_torneo() to public, anon, authenticated;
grant execute on function public.notificar_torneo_iniciado() to public, anon, authenticated;

-- 7. Configuracion
drop policy configuracion_update on public.configuracion;
create policy configuracion_update on public.configuracion for update to authenticated using (true);

-- 6. Notificaciones
create policy notificaciones_select on public.notificaciones for select to authenticated using (true);
create policy notificaciones_update on public.notificaciones for update to authenticated using (true);

-- 5. Mensajes directos
drop policy mensajes_directos_select on public.mensajes_directos;
drop policy mensajes_directos_insert on public.mensajes_directos;
drop policy mensajes_directos_update on public.mensajes_directos;
create policy mensajes_directos_select on public.mensajes_directos for select to authenticated using (true);
create policy mensajes_directos_insert on public.mensajes_directos for insert to authenticated with check (true);
create policy mensajes_directos_update on public.mensajes_directos for update to authenticated using (true);
grant update on public.mensajes_directos to anon, authenticated;

-- 4. Inscripciones
drop policy "Cada usuario se inscribe a si mismo" on public.inscripciones;
create policy "Public Delete" on public.inscripciones for delete to public using (true);
create policy "Public Insert" on public.inscripciones for insert to public with check (true);

-- 3. Partidos
drop policy "Todos ven los partidos" on public.partidos;
drop policy "Solo admins eliminan partidos" on public.partidos;
alter table public.partidos disable row level security;

-- 2. Torneos
create policy "Public Insert" on public.torneos for insert to public with check (true);
create policy "Public Update" on public.torneos for update to public using (true) with check (true);
create policy "Public Delete" on public.torneos for delete to public using (true);

-- 1. Usuarios
drop policy "Usuarios pueden insertar su propio perfil" on public.usuarios;
create policy "Usuarios pueden insertar su propio perfil" on public.usuarios for insert to authenticated with check (true);
drop policy "Usuarios pueden actualizar su propio perfil" on public.usuarios;
create policy "Usuarios pueden actualizar su propio perfil" on public.usuarios for update to authenticated using (auth.uid() = id);
drop trigger proteger_columnas_usuarios on public.usuarios;
drop function public.proteger_columnas_usuarios();

-- Helpers
drop function public.soy_admin();
drop function public.mi_usuario();
