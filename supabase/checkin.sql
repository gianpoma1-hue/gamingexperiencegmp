-- Check-in antes del torneo + marca de W.O. en los partidos.
-- El check-in se abre 30 minutos antes de la hora del torneo y se cierra a la hora de inicio.
-- Lo hace quien figura en la inscripción (el jugador, o el capitán en torneos por equipos).

alter table public.inscripciones add column if not exists checkin_at timestamptz;
alter table public.partidos add column if not exists wo boolean not null default false;

-- Estado del check-in del usuario logueado en un torneo
create or replace function public.mi_checkin(p_torneo uuid)
returns table (inscripto boolean, confirmado boolean, checkin_at timestamptz)
language sql stable security definer set search_path = public as $$
  select true, i.estado_pago = 'confirmado', i.checkin_at
  from public.inscripciones i
  where i.torneo_id = p_torneo and i.usuario = public.mi_usuario()
  limit 1
$$;

-- Hacer check-in (solo dentro de la ventana y con el pago confirmado)
create or replace function public.hacer_checkin(p_torneo uuid)
returns timestamptz
language plpgsql security definer set search_path = public as $$
declare
  t record;
  inicio timestamptz;
  resultado timestamptz;
begin
  if auth.uid() is null then
    raise exception 'Tenés que iniciar sesión';
  end if;

  select fecha, hora, estado into t from public.torneos where id = p_torneo;
  if not found then
    raise exception 'El torneo no existe';
  end if;
  if t.estado = 'Finalizado' then
    raise exception 'El torneo ya terminó';
  end if;

  inicio := (t.fecha + coalesce(t.hora, '00:00'::time)) at time zone 'America/Argentina/Buenos_Aires';

  if now() < inicio - interval '30 minutes' then
    raise exception 'El check-in todavía no está abierto (se abre 30 minutos antes)';
  end if;
  if now() >= inicio then
    raise exception 'El check-in ya cerró';
  end if;

  update public.inscripciones
     set checkin_at = coalesce(checkin_at, now())
   where torneo_id = p_torneo
     and usuario = public.mi_usuario()
     and estado_pago = 'confirmado'
  returning checkin_at into resultado;

  if resultado is null then
    raise exception 'No tenés una inscripción confirmada en este torneo';
  end if;

  return resultado;
end $$;

revoke execute on function public.mi_checkin(uuid) from public, anon;
revoke execute on function public.hacer_checkin(uuid) from public, anon;
grant execute on function public.mi_checkin(uuid) to authenticated;
grant execute on function public.hacer_checkin(uuid) to authenticated;
