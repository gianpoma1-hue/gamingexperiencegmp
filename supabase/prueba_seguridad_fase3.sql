-- Prueba de seguridad fase 3 (correr DESPUÉS de seguridad_fase3b.sql). NO cambia ningún dato:
-- al final tira un error a propósito ("RESULTADOS ...") que deshace todo.
do $$
declare r text := ''; n int; t text;
  jug uuid; jug_usuario text; adm uuid; tor uuid;
begin
  select id, usuario into jug, jug_usuario from usuarios where coalesce(es_admin,false) = false and usuario is not null limit 1;
  select id into adm from usuarios where es_admin = true limit 1;
  select torneo_id into tor from inscripciones group by torneo_id order by count(*) desc limit 1;

  -- ===== JUGADOR =====
  perform set_config('request.jwt.claims', json_build_object('sub',jug,'role','authenticated')::text, true);
  perform set_config('role','authenticated', true);
  begin select email into t from usuarios limit 1; r:=r||' | J lee emails: PERMITIDO(MAL)'; exception when others then r:=r||' | J lee emails: bloqueado'; end;
  begin select count(*) into n from usuarios where usuario is not null; r:=r||' | J ve ranking (sin email) filas='||n; exception when others then r:=r||' | J ve ranking: ERROR '||sqlerrm; end;
  select count(*) into n from inscripciones where usuario <> public.mi_usuario(); r:=r||' | J ve inscripciones ajenas='||n;
  select count(*) into n from inscripciones where usuario = public.mi_usuario(); r:=r||' | J ve sus inscripciones='||n;
  r:=r||' | J cupos del torneo='||public.contar_inscriptos(tor);
  begin perform * from public.admin_listar_usuarios(); r:=r||' | J lista usuarios con email: PERMITIDO(MAL)'; exception when others then r:=r||' | J lista usuarios con email: bloqueado'; end;

  -- ===== VISITANTE SIN CUENTA =====
  perform set_config('request.jwt.claims', '{"role":"anon"}', true);
  perform set_config('role','anon', true);
  select count(*) into n from inscripciones; r:=r||' | A ve inscripciones='||n;
  r:=r||' | A cupos del torneo='||public.contar_inscriptos(tor);
  select count(*) into n from public.escudos_torneo(tor); r:=r||' | A escudos de la llave='||n;
  begin select email into t from usuarios limit 1; r:=r||' | A lee emails: PERMITIDO(MAL)'; exception when others then r:=r||' | A lee emails: bloqueado'; end;

  -- ===== ADMIN =====
  perform set_config('request.jwt.claims', json_build_object('sub',adm,'role','authenticated')::text, true);
  perform set_config('role','authenticated', true);
  select count(*) into n from inscripciones; r:=r||' | ADM ve inscripciones='||n;
  select count(*) into n from public.admin_listar_usuarios() where email is not null; r:=r||' | ADM lista usuarios con email='||n;
  begin select count(*) into n from usuarios where id = jug; r:=r||' | ADM ve usuario filas='||n; exception when others then r:=r||' | ADM ve usuario: ERROR '||sqlerrm; end;
  begin update usuarios set victorias = victorias where id = jug; get diagnostics n=row_count; r:=r||' | ADM edita usuario filas='||n; exception when others then r:=r||' | ADM edita usuario: ERROR '||sqlerrm; end;

  raise exception 'RESULTADOS%', r;  -- fuerza que se deshaga todo
end $$;
