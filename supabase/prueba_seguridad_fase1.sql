-- Prueba de seguridad fase 1. NO cambia ningún dato:
-- al final tira un error a propósito ("RESULTADOS ...") que deshace todo.
-- Copiá el mensaje rojo completo y pasáselo a Claude.
do $$
declare r text := ''; n int;
  jug uuid := '1e0158f2-3bc8-482b-bae4-29be7e2085bd';  -- jugador común (gianpopo)
  adm uuid := '2b69554b-fe13-4d11-9b3f-169c7668cdab';  -- admin
  tor uuid := '69df7773-b032-48c8-a78d-85052efa28ce';  -- un torneo Abierto
begin
  -- ===== JUGADOR =====
  perform set_config('request.jwt.claims', json_build_object('sub',jug,'role','authenticated')::text, true);
  perform set_config('role','authenticated', true);
  begin update usuarios set es_admin=true where id=jug; r:=r||' | J hacerse admin: PERMITIDO(MAL)'; exception when others then r:=r||' | J hacerse admin: bloqueado'; end;
  begin update usuarios set victorias=victorias+50 where id=jug; r:=r||' | J inflar victorias: PERMITIDO(MAL)'; exception when others then r:=r||' | J inflar victorias: bloqueado'; end;
  begin update usuarios set foto_perfil=foto_perfil where id=jug; get diagnostics n=row_count; r:=r||' | J cambiar foto: ok filas='||n; exception when others then r:=r||' | J cambiar foto: ERROR '||sqlerrm; end;
  update partidos set ganador='hack'; get diagnostics n=row_count; r:=r||' | J update partidos filas='||n;
  update torneos set nombre=nombre; get diagnostics n=row_count; r:=r||' | J update torneos filas='||n;
  update configuracion set updated_at=updated_at; get diagnostics n=row_count; r:=r||' | J update config filas='||n;
  begin insert into inscripciones(torneo_id,nombre,usuario,plataforma,estado_pago) values (tor,'t',public.mi_usuario(),'PS5','confirmado'); r:=r||' | J inscribirse confirmado: PERMITIDO(MAL)'; exception when others then r:=r||' | J inscribirse confirmado: bloqueado'; end;
  begin insert into inscripciones(torneo_id,nombre,usuario,plataforma,estado_pago) values (tor,'t','otro_usuario_x','PS5','pendiente'); r:=r||' | J inscribir a otro: PERMITIDO(MAL)'; exception when others then r:=r||' | J inscribir a otro: bloqueado'; end;
  begin insert into inscripciones(torneo_id,nombre,usuario,plataforma,estado_pago) values (tor,'t',public.mi_usuario(),'PS5','pendiente'); r:=r||' | J inscribirse pendiente: ok'; exception when others then r:=r||' | J inscribirse pendiente: ERROR '||sqlerrm; end;
  select count(*) into n from mensajes_directos where remitente<>public.mi_usuario() and destinatario<>public.mi_usuario() and conversacion_id<>'soporte::'||public.mi_usuario(); r:=r||' | J ve DMs ajenos='||n;
  select count(*) into n from notificaciones where usuario<>public.mi_usuario(); r:=r||' | J ve notifs ajenas='||n;
  begin perform actualizar_estadisticas(public.mi_usuario(),0,0,0,0,0,0); r:=r||' | J rpc ranking: PERMITIDO(MAL)'; exception when others then r:=r||' | J rpc ranking: bloqueado'; end;

  -- ===== VISITANTE SIN CUENTA =====
  perform set_config('request.jwt.claims', '{"role":"anon"}', true);
  perform set_config('role','anon', true);
  update partidos set ganador='hack'; get diagnostics n=row_count; r:=r||' | A update partidos filas='||n;
  update torneos set nombre='hack'; get diagnostics n=row_count; r:=r||' | A update torneos filas='||n;
  delete from inscripciones; get diagnostics n=row_count; r:=r||' | A delete inscripciones filas='||n;
  begin insert into inscripciones(torneo_id,nombre,usuario,plataforma,estado_pago) values (tor,'t','x','PS5','confirmado'); r:=r||' | A insert inscripcion: PERMITIDO(MAL)'; exception when others then r:=r||' | A insert inscripcion: bloqueado'; end;
  begin perform actualizar_estadisticas('x',0,0,0,0,0,0); r:=r||' | A rpc ranking: PERMITIDO(MAL)'; exception when others then r:=r||' | A rpc ranking: bloqueado'; end;
  select count(*) into n from torneos where estado='Abierto'; r:=r||' | A ve torneos abiertos='||n;
  select count(*) into n from inscripciones; r:=r||' | A cuenta inscripciones='||n;
  select count(*) into n from partidos; r:=r||' | A ve partidos='||n;

  -- ===== ADMIN =====
  perform set_config('request.jwt.claims', json_build_object('sub',adm,'role','authenticated')::text, true);
  perform set_config('role','authenticated', true);
  update torneos set nombre=nombre where id=tor; get diagnostics n=row_count; r:=r||' | ADM update torneo filas='||n;
  update partidos set ganador=ganador where torneo_id is not null; get diagnostics n=row_count; r:=r||' | ADM update partidos filas='||n;
  begin update usuarios set victorias=victorias where id=jug; get diagnostics n=row_count; r:=r||' | ADM editar usuario filas='||n; exception when others then r:=r||' | ADM editar usuario: ERROR '||sqlerrm; end;
  begin insert into inscripciones(torneo_id,nombre,usuario,plataforma,estado_pago) values (tor,'t','alguien','PS5','confirmado'); r:=r||' | ADM inscribir confirmado: ok'; exception when others then r:=r||' | ADM inscribir: ERROR '||sqlerrm; end;
  begin perform actualizar_estadisticas('gianpopo',0,0,0,0,0,0); r:=r||' | ADM rpc ranking: ok'; exception when others then r:=r||' | ADM rpc ranking: ERROR '||sqlerrm; end;
  update configuracion set updated_at=updated_at; get diagnostics n=row_count; r:=r||' | ADM update config filas='||n;
  select count(*) into n from mensajes_directos where conversacion_id like 'soporte::%'; r:=r||' | ADM ve soporte='||n;

  raise exception 'RESULTADOS%', r;  -- fuerza que se deshaga todo
end $$;
