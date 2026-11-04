-- Seguridad fase 3 — paso B (2026-11-04). Se corre DESPUÉS de que el código nuevo esté publicado.
-- Requiere seguridad_fase3a.sql. Rollback: seguridad_fase3_rollback.sql

-- 1. USUARIOS: nadie lee la columna email (los admins la ven con admin_listar_usuarios()).
revoke select on public.usuarios from anon, authenticated;
grant select (id, nombre, usuario, plataforma, foto_perfil, created_at,
              partidos_jugados, victorias, derrotas, goles_favor, goles_contra, torneos_ganados,
              es_admin, admin)
  on public.usuarios to anon, authenticated;

-- 2. INSCRIPCIONES: cada jugador ve solo las suyas; los admins todas.
--    Los cupos y los escudos públicos salen de contar_inscriptos() y escudos_torneo().
drop policy "Public Select" on public.inscripciones;
create policy "Cada usuario ve sus inscripciones" on public.inscripciones
  for select to authenticated using (public.soy_admin() or usuario = public.mi_usuario());
