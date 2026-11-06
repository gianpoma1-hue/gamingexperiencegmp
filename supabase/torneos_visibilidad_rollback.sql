-- Rollback de torneos_visibilidad.sql: todos los torneos vuelven a verse para todo el mundo.

create or replace function public.notificar_nuevo_torneo() returns trigger
language plpgsql security definer set search_path to 'public' as $$
begin
  if coalesce(new.notificar, true) then
    insert into notificaciones (usuario, tipo, titulo, contenido, link)
    select u.usuario, 'torneo_nuevo', 'Nuevo torneo disponible', new.nombre, '/torneos'
    from usuarios u;
  end if;
  return new;
end;
$$;

drop policy "Visitantes ven torneos visibles" on public.torneos;
drop policy "Jugadores ven visibles, admins todos" on public.torneos;
create policy "Public Read" on public.torneos for select to public using (true);

-- La columna puede quedar (no hace daño). Para borrarla:
-- alter table public.torneos drop column if exists visible;
