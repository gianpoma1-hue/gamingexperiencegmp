-- Seguridad fase 2 (2026-11-04). Requiere la fase 1 (usa mi_usuario() y soy_admin()).
-- Rollback: supabase/seguridad_fase2_rollback.sql

-- 1. REPORTES DE RESULTADO: solo los del partido (jugadores o capitanes) y los admins
drop policy reportes_resultado_select on public.reportes_resultado;
drop policy reportes_resultado_insert on public.reportes_resultado;
drop policy reportes_resultado_update on public.reportes_resultado;

create policy reportes_resultado_select on public.reportes_resultado for select to authenticated using (
  public.soy_admin()
  or exists (select 1 from public.partidos p where p.id = reportes_resultado.partido_id
             and public.mi_usuario() in (p.jugador1, p.jugador2, p.capitan1, p.capitan2))
);
create policy reportes_resultado_insert on public.reportes_resultado for insert to authenticated with check (
  autor_usuario = public.mi_usuario()
  and (
    public.soy_admin()
    or (coalesce(es_admin,false) = false
        and exists (select 1 from public.partidos p where p.id = reportes_resultado.partido_id
                    and public.mi_usuario() in (p.jugador1, p.jugador2, p.capitan1, p.capitan2)))
  )
);
-- solo el admin marca como leído (es lo único que hace el sitio)
create policy reportes_resultado_update on public.reportes_resultado for update to authenticated
  using (public.soy_admin()) with check (public.soy_admin());
revoke update on public.reportes_resultado from anon, authenticated;
grant update (leido) on public.reportes_resultado to authenticated;

-- 2. AMIGOS: cada uno ve sus solicitudes; solo el que la recibe la acepta o rechaza
drop policy amigos_select on public.amigos;
drop policy amigos_insert on public.amigos;
drop policy amigos_update on public.amigos;

create policy amigos_select on public.amigos for select to authenticated using (
  public.mi_usuario() in (usuario_solicitante, usuario_receptor)
);
create policy amigos_insert on public.amigos for insert to authenticated with check (
  usuario_solicitante = public.mi_usuario()
  and usuario_receptor <> usuario_solicitante
  and estado = 'pendiente'
);
create policy amigos_update on public.amigos for update to authenticated
  using (usuario_receptor = public.mi_usuario())
  with check (usuario_receptor = public.mi_usuario() and estado in ('aceptada', 'rechazada'));
revoke update on public.amigos from anon, authenticated;
grant update (estado) on public.amigos to authenticated;

-- 3. NOTIFICACIONES: los jugadores solo mandan links internos (evita links a páginas falsas);
--    al actualizar solo se puede tocar "leida"
drop policy notificaciones_insert on public.notificaciones;
create policy notificaciones_insert on public.notificaciones for insert to authenticated with check (
  public.soy_admin()
  or link is null
  or (link like '/%' and link not like '//%')
);
revoke update on public.notificaciones from anon, authenticated;
grant update (leida) on public.notificaciones to authenticated;

-- 4. USUARIOS: al registrarse, estadísticas siempre en 0
drop policy "Usuarios pueden insertar su propio perfil" on public.usuarios;
create policy "Usuarios pueden insertar su propio perfil" on public.usuarios
  for insert to authenticated with check (
    auth.uid() = id
    and coalesce(es_admin,false) = false and coalesce(admin,false) = false
    and coalesce(partidos_jugados,0) = 0 and coalesce(victorias,0) = 0 and coalesce(derrotas,0) = 0
    and coalesce(goles_favor,0) = 0 and coalesce(goles_contra,0) = 0 and coalesce(torneos_ganados,0) = 0
  );

-- 5. CHAT DEL PARTIDO: arregla torneos por equipos (el sitio identifica al capitán, no al equipo)
drop policy "Los jugadores del partido envian mensajes" on public.mensajes_partido;
drop policy "Los jugadores del partido ven sus mensajes" on public.mensajes_partido;
create policy "Los jugadores del partido envian mensajes" on public.mensajes_partido for insert to authenticated with check (
  autor_usuario = public.mi_usuario()
  and exists (select 1 from public.partidos p where p.id = mensajes_partido.partido_id
              and public.mi_usuario() in (p.jugador1, p.jugador2, p.capitan1, p.capitan2))
);
create policy "Los jugadores del partido ven sus mensajes" on public.mensajes_partido for select to authenticated using (
  public.soy_admin()
  or exists (select 1 from public.partidos p where p.id = mensajes_partido.partido_id
             and public.mi_usuario() in (p.jugador1, p.jugador2, p.capitan1, p.capitan2))
);

-- 6. HISTORIAL DE FINANZAS: hoy no tiene reglas y el panel admin no puede guardarlo
create policy "Solo admins ven historial de finanzas" on public.finanzas_historial
  for select to authenticated using (public.soy_admin());
create policy "Solo admins guardan historial de finanzas" on public.finanzas_historial
  for insert to authenticated with check (public.soy_admin());
