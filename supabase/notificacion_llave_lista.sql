-- Aviso al tocar "Empezar" (2026-11-06). La llave se puede armar antes de la hora de inicio,
-- así que el aviso dice la verdad según el momento:
--   - si todavía no llegó la hora: "¡Ya está la llave de tu torneo!" + cuándo empieza
--   - si ya es la hora (o pasó):   "¡Tu torneo empezó!" (como hasta ahora)
-- Solo cambia el texto del aviso. Rollback: al final del archivo.

create or replace function public.notificar_torneo_iniciado() returns trigger
language plpgsql security definer set search_path to 'public' as $$
declare
  inicio timestamptz;
  titulo text := '¡Tu torneo empezó!';
  contenido text := new.nombre;
begin
  if new.estado = 'En curso' and (old.estado is distinct from 'En curso') then
    -- fecha y hora del torneo, en hora de Argentina
    inicio := (new.fecha + coalesce(new.hora, time '00:00')) at time zone 'America/Argentina/Buenos_Aires';

    if inicio > now() then
      titulo := '¡Ya está la llave de tu torneo!';
      contenido := new.nombre || ' · empieza el ' || to_char(new.fecha, 'DD/MM')
        || coalesce(' a las ' || to_char(new.hora, 'HH24:MI') || ' h', '');
    end if;

    insert into notificaciones (usuario, tipo, titulo, contenido, link)
    select i.usuario, 'torneo_iniciado', titulo, contenido, '/torneos/llave/' || new.id
    from inscripciones i
    where i.torneo_id = new.id
      and i.estado_pago = 'confirmado';
  end if;

  return new;
end;
$$;

-- Rollback (vuelve al texto de siempre):
-- create or replace function public.notificar_torneo_iniciado() returns trigger
-- language plpgsql security definer set search_path to 'public' as $$
-- begin
--   if new.estado = 'En curso' and (old.estado is distinct from 'En curso') then
--     insert into notificaciones (usuario, tipo, titulo, contenido, link)
--     select i.usuario, 'torneo_iniciado', '¡Tu torneo empezó!', new.nombre, '/torneos/llave/' || new.id
--     from inscripciones i where i.torneo_id = new.id and i.estado_pago = 'confirmado';
--   end if;
--   return new;
-- end;
-- $$;
