-- Prueba de inscripcion_solo_abierto.sql. NO cambia ningún dato:
-- crea torneos de mentira y al final tira un error a propósito ("RESULTADOS ...")
-- que deshace todo. Copiá el mensaje rojo completo y pasáselo a Claude.
do $$
declare r text := '';
  j uuid; j_usuario text; adm uuid; adm_usuario text;
  t_abierto uuid; t_cerrado uuid; t_curso uuid; t_lleno uuid;
begin
  select id, usuario into j, j_usuario from usuarios
    where coalesce(es_admin,false) = false and usuario is not null limit 1;
  select id, usuario into adm, adm_usuario from usuarios where es_admin = true limit 1;
  if j is null or adm is null then
    raise exception 'FALTAN DATOS PARA LA PRUEBA (jugador=%, admin=%)', j, adm;
  end if;

  insert into torneos(nombre, juego, plataforma, jugadores_max, premio, inscripcion, fecha, hora, estado, notificar)
    values ('PRUEBA abierto', 'x', 'PC', 4, 0, 0, current_date, '21:00', 'Abierto', false) returning id into t_abierto;
  insert into torneos(nombre, juego, plataforma, jugadores_max, premio, inscripcion, fecha, hora, estado, notificar)
    values ('PRUEBA cerrado', 'x', 'PC', 4, 0, 0, current_date, '21:00', 'Cerrado', false) returning id into t_cerrado;
  insert into torneos(nombre, juego, plataforma, jugadores_max, premio, inscripcion, fecha, hora, estado, notificar)
    values ('PRUEBA en curso', 'x', 'PC', 4, 0, 0, current_date, '21:00', 'En curso', false) returning id into t_curso;
  insert into torneos(nombre, juego, plataforma, jugadores_max, premio, inscripcion, fecha, hora, estado, notificar)
    values ('PRUEBA lleno', 'x', 'PC', 1, 0, 0, current_date, '21:00', 'Abierto', false) returning id into t_lleno;
  insert into inscripciones(torneo_id, nombre, usuario) values (t_lleno, 'otro', 'otro_x');

  -- ===== JUGADOR =====
  perform set_config('request.jwt.claims', json_build_object('sub',j,'role','authenticated')::text, true);
  perform set_config('role','authenticated', true);
  begin insert into inscripciones(torneo_id, nombre, usuario, estado_pago) values (t_abierto, 'x', j_usuario, 'pendiente'); r:=r||' | J se anota en Abierto: ok'; exception when others then r:=r||' | J Abierto: ERROR '||sqlerrm; end;
  begin insert into inscripciones(torneo_id, nombre, usuario, estado_pago) values (t_cerrado, 'x', j_usuario, 'pendiente'); r:=r||' | J en Cerrado: PERMITIDO(MAL)'; exception when others then r:=r||' | J en Cerrado: bloqueado ('||sqlerrm||')'; end;
  begin insert into inscripciones(torneo_id, nombre, usuario, estado_pago) values (t_curso, 'x', j_usuario, 'pendiente'); r:=r||' | J en En curso: PERMITIDO(MAL)'; exception when others then r:=r||' | J en En curso: bloqueado ('||sqlerrm||')'; end;
  begin insert into inscripciones(torneo_id, nombre, usuario, estado_pago) values (t_lleno, 'x', j_usuario, 'pendiente'); r:=r||' | J en lleno: PERMITIDO(MAL)'; exception when others then r:=r||' | J en lleno: bloqueado ('||sqlerrm||')'; end;

  -- ===== ADMIN (puede agregar a mano aunque esté cerrado) =====
  perform set_config('request.jwt.claims', json_build_object('sub',adm,'role','authenticated')::text, true);
  begin insert into inscripciones(torneo_id, nombre, usuario, estado_pago) values (t_cerrado, 'x', 'otro_y', 'confirmado'); r:=r||' | ADM agrega en Cerrado: ok'; exception when others then r:=r||' | ADM en Cerrado: ERROR '||sqlerrm; end;

  raise exception 'RESULTADOS%', r;  -- fuerza que se deshaga todo
end $$;
