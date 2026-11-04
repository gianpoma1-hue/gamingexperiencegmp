-- Rollback de supabase/seguridad_fase2.sql: deja todo como estaba antes de la fase 2.
-- ATENCIÓN: vuelve a abrir esos permisos. Usar solo si algo se rompió.

-- 6. Finanzas
drop policy "Solo admins ven historial de finanzas" on public.finanzas_historial;
drop policy "Solo admins guardan historial de finanzas" on public.finanzas_historial;

-- 5. Chat del partido
drop policy "Los jugadores del partido envian mensajes" on public.mensajes_partido;
drop policy "Los jugadores del partido ven sus mensajes" on public.mensajes_partido;
create policy "Los jugadores del partido envian mensajes" on public.mensajes_partido for insert to authenticated with check (
  exists (select 1 from (partidos p join usuarios u on (u.id = auth.uid()))
          where p.id = mensajes_partido.partido_id and (p.jugador1 = u.usuario or p.jugador2 = u.usuario)
            and u.usuario = mensajes_partido.autor_usuario)
);
create policy "Los jugadores del partido ven sus mensajes" on public.mensajes_partido for select to authenticated using (
  exists (select 1 from (partidos p join usuarios u on (u.id = auth.uid()))
          where p.id = mensajes_partido.partido_id and (p.jugador1 = u.usuario or p.jugador2 = u.usuario))
);

-- 4. Usuarios (vuelve a la versión de la fase 1)
drop policy "Usuarios pueden insertar su propio perfil" on public.usuarios;
create policy "Usuarios pueden insertar su propio perfil" on public.usuarios
  for insert to authenticated
  with check (auth.uid() = id and coalesce(es_admin,false) = false and coalesce(admin,false) = false);

-- 3. Notificaciones
drop policy notificaciones_insert on public.notificaciones;
create policy notificaciones_insert on public.notificaciones for insert to authenticated with check (true);
grant update on public.notificaciones to anon, authenticated;

-- 2. Amigos
drop policy amigos_select on public.amigos;
drop policy amigos_insert on public.amigos;
drop policy amigos_update on public.amigos;
create policy amigos_select on public.amigos for select to authenticated using (true);
create policy amigos_insert on public.amigos for insert to authenticated with check (true);
create policy amigos_update on public.amigos for update to authenticated using (true);
grant update on public.amigos to anon, authenticated;

-- 1. Reportes de resultado
drop policy reportes_resultado_select on public.reportes_resultado;
drop policy reportes_resultado_insert on public.reportes_resultado;
drop policy reportes_resultado_update on public.reportes_resultado;
create policy reportes_resultado_select on public.reportes_resultado for select to authenticated using (true);
create policy reportes_resultado_insert on public.reportes_resultado for insert to authenticated with check (true);
create policy reportes_resultado_update on public.reportes_resultado for update to authenticated using (true);
grant update on public.reportes_resultado to anon, authenticated;
