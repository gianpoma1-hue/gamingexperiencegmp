-- Inscripciones: solo en torneos "Abierto" y con cupo libre.
-- Hasta ahora lo controlaba solo la página; con la API se podía saltear
-- (anotarse a un torneo En curso / Finalizado / Cerrado o pasarse del cupo).
-- Los admins quedan exentos (pueden agregar a alguien a mano).

create or replace function public.validar_inscripcion() returns trigger
language plpgsql security definer set search_path = public as $$
declare
  t record;
  ocupados int;
begin
  -- SQL Editor / cron (sin usuario) y admins: sin restricciones
  if auth.uid() is null or public.soy_admin() then
    return new;
  end if;

  -- Bloquea la fila del torneo para que dos inscripciones simultáneas
  -- no se pasen del cupo.
  select estado, jugadores_max into t
    from public.torneos where id = new.torneo_id for update;

  if not found then
    raise exception 'El torneo no existe';
  end if;

  if t.estado is distinct from 'Abierto' then
    raise exception 'Este torneo no admite inscripciones';
  end if;

  select count(*) into ocupados from public.inscripciones where torneo_id = new.torneo_id;
  if ocupados >= t.jugadores_max then
    raise exception 'Este torneo ya está completo';
  end if;

  return new;
end $$;

revoke execute on function public.validar_inscripcion() from public, anon, authenticated;

drop trigger if exists validar_inscripcion on public.inscripciones;
create trigger validar_inscripcion before insert on public.inscripciones
  for each row execute function public.validar_inscripcion();
