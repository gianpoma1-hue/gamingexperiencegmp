-- Prueba de torneos_visibilidad.sql (correr DESPUÉS). NO cambia ningún dato:
-- al final tira un error a propósito ("RESULTADOS ...") que deshace todo.
do $$
declare r text := ''; n int; jug uuid; adm uuid; t_prueba uuid; avisos_antes int; avisos_despues int;
begin
  select id into jug from usuarios where coalesce(es_admin,false) = false and usuario is not null limit 1;
  select id into adm from usuarios where es_admin = true limit 1;

  -- Creamos un torneo de prueba (como postgres, sin JWT) y medimos si mandó avisos
  select count(*) into avisos_antes from notificaciones where tipo = 'torneo_nuevo';
  insert into torneos (nombre, juego, plataforma, jugadores_max, premio, inscripcion, fecha, hora, estado, visible, notificar)
  values ('__prueba_oculta__', 'Counter-Strike 2', 'PC', 8, 0, 0, current_date, '22:00', 'Abierto', false, true)
  returning id into t_prueba;
  select count(*) into avisos_despues from notificaciones where tipo = 'torneo_nuevo';
  r := r || ' | torneo de prueba mandó avisos=' || (avisos_despues - avisos_antes);

  perform set_config('request.jwt.claims', '{"role":"anon"}', true);
  perform set_config('role','anon', true);
  select count(*) into n from torneos where id = t_prueba; r := r || ' | visitante ve el de prueba=' || n;
  select count(*) into n from torneos where visible; r := r || ' | visitante ve visibles=' || n;

  perform set_config('request.jwt.claims', json_build_object('sub',jug,'role','authenticated')::text, true);
  perform set_config('role','authenticated', true);
  select count(*) into n from torneos where id = t_prueba; r := r || ' | jugador ve el de prueba=' || n;
  select count(*) into n from torneos where visible; r := r || ' | jugador ve visibles=' || n;

  perform set_config('request.jwt.claims', json_build_object('sub',adm,'role','authenticated')::text, true);
  select count(*) into n from torneos where id = t_prueba; r := r || ' | admin ve el de prueba=' || n;

  raise exception 'RESULTADOS%', r;  -- fuerza que se deshaga todo
end $$;
