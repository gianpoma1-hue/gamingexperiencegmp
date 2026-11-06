-- Torneos de prueba (2026-11-05): un torneo puede ser "visible para todos" o "de prueba".
-- Un torneo de prueba solo lo ven los admins (no aparece en la home, en los juegos, ni por link)
-- y nunca manda la notificación de torneo nuevo.
-- Requiere la fase 1 de seguridad (usa public.soy_admin()). Rollback: torneos_visibilidad_rollback.sql

-- 1. Columna: todos los torneos que ya existen quedan visibles, como hasta ahora.
alter table public.torneos add column if not exists visible boolean not null default true;

-- 2. Lectura: los visitantes y jugadores ven solo los visibles; los admins, todos.
drop policy "Public Read" on public.torneos;
create policy "Visitantes ven torneos visibles" on public.torneos
  for select to anon using (visible);
create policy "Jugadores ven visibles, admins todos" on public.torneos
  for select to authenticated using (visible or public.soy_admin());

-- 3. Aviso de torneo nuevo: solo si se eligió notificar Y el torneo es visible.
create or replace function public.notificar_nuevo_torneo() returns trigger
language plpgsql security definer set search_path to 'public' as $$
begin
  if coalesce(new.notificar, true) and coalesce(new.visible, true) then
    insert into notificaciones (usuario, tipo, titulo, contenido, link)
    select u.usuario, 'torneo_nuevo', 'Nuevo torneo disponible', new.nombre, '/torneos'
    from usuarios u;
  end if;
  return new;
end;
$$;
