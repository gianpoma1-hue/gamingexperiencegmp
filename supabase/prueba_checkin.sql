-- Prueba de checkin.sql. NO cambia ningún dato: crea torneos de mentira y
-- al final tira un error a propósito ("RESULTADOS ...") que deshace todo.
-- Copiá el mensaje rojo completo y pasáselo a Claude.
do $$
declare r text := ''; x timestamptz; n int;
  j uuid; j_usuario text; otro uuid;
  t_ahora uuid; t_lejos uuid; t_pasado uuid;
  -- hora local de Argentina dentro de 10 minutos / en 3 horas / hace 10 minutos
  en10 timestamp := (now() + interval '10 minutes') at time zone 'America/Argentina/Buenos_Aires';
  en3h timestamp := (now() + interval '3 hours') at time zone 'America/Argentina/Buenos_Aires';
  hace10 timestamp := (now() - interval '10 minutes') at time zone 'America/Argentina/Buenos_Aires';
begin
  select id, usuario into j, j_usuario from usuarios
    where coalesce(es_admin,false) = false and usuario is not null limit 1;
  select id into otro from usuarios
    where coalesce(es_admin,false) = false and usuario is not null and id <> j limit 1;
  if j is null or otro is null then
    raise exception 'FALTAN DATOS PARA LA PRUEBA (jugador=%, otro=%)', j, otro;
  end if;

  insert into torneos(nombre, juego, plataforma, jugadores_max, premio, inscripcion, fecha, hora, estado, notificar)
    values ('PRUEBA checkin ahora', 'x', 'PC', 4, 0, 0, en10::date, en10::time, 'En curso', false) returning id into t_ahora;
  insert into torneos(nombre, juego, plataforma, jugadores_max, premio, inscripcion, fecha, hora, estado, notificar)
    values ('PRUEBA checkin lejos', 'x', 'PC', 4, 0, 0, en3h::date, en3h::time, 'Abierto', false) returning id into t_lejos;
  insert into torneos(nombre, juego, plataforma, jugadores_max, premio, inscripcion, fecha, hora, estado, notificar)
    values ('PRUEBA checkin pasado', 'x', 'PC', 4, 0, 0, hace10::date, hace10::time, 'En curso', false) returning id into t_pasado;

  insert into inscripciones(torneo_id, nombre, usuario, estado_pago) values
    (t_ahora, 'x', j_usuario, 'confirmado'),
    (t_lejos, 'x', j_usuario, 'confirmado'),
    (t_pasado, 'x', j_usuario, 'confirmado');

  -- ===== JUGADOR INSCRIPTO =====
  perform set_config('request.jwt.claims', json_build_object('sub',j,'role','authenticated')::text, true);
  perform set_config('role','authenticated', true);
  begin x := hacer_checkin(t_ahora); r:=r||' | J check-in 10 min antes: ok'; exception when others then r:=r||' | J check-in 10 min antes: ERROR '||sqlerrm; end;
  select count(*) into n from mi_checkin(t_ahora) where checkin_at is not null; r:=r||' | J ve su check-in='||n;
  begin x := hacer_checkin(t_lejos); r:=r||' | J check-in 3 h antes: PERMITIDO(MAL)'; exception when others then r:=r||' | J 3 h antes: bloqueado ('||sqlerrm||')'; end;
  begin x := hacer_checkin(t_pasado); r:=r||' | J check-in después del inicio: PERMITIDO(MAL)'; exception when others then r:=r||' | J después del inicio: bloqueado ('||sqlerrm||')'; end;
  begin update inscripciones set checkin_at = now() where torneo_id = t_lejos; get diagnostics n=row_count;
    r:=r||' | J se marca check-in a mano filas='||n; exception when others then r:=r||' | J a mano: bloqueado'; end;

  -- ===== OTRO JUGADOR (no inscripto) =====
  perform set_config('request.jwt.claims', json_build_object('sub',otro,'role','authenticated')::text, true);
  begin x := hacer_checkin(t_ahora); r:=r||' | NO inscripto hace check-in: PERMITIDO(MAL)'; exception when others then r:=r||' | NO inscripto: bloqueado ('||sqlerrm||')'; end;

  raise exception 'RESULTADOS%', r;  -- fuerza que se deshaga todo
end $$;
