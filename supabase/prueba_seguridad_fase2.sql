-- Prueba de seguridad fase 2. NO cambia ningún dato:
-- al final tira un error a propósito ("RESULTADOS ...") que deshace todo.
-- Copiá el mensaje rojo completo y pasáselo a Claude.
do $$
declare r text := ''; n int;
  p record;            -- un partido por equipos (capitán distinto del nombre del equipo)
  cap uuid;            -- el capitán 1 de ese partido
  aj uuid;             -- un jugador común que NO está en ese partido
  aj_usuario text;
  adm uuid;
begin
  select * into p from partidos where capitan1 is not null and capitan1 <> jugador1 limit 1;
  select id into cap from usuarios where usuario = p.capitan1;
  select id, usuario into aj, aj_usuario from usuarios
    where coalesce(es_admin,false) = false and usuario is not null
      and usuario not in (coalesce(p.jugador1,''), coalesce(p.jugador2,''), coalesce(p.capitan1,''), coalesce(p.capitan2,''))
    limit 1;
  select id into adm from usuarios where es_admin = true limit 1;
  if p.id is null or cap is null or aj is null or adm is null then
    raise exception 'FALTAN DATOS PARA LA PRUEBA (partido=%, capitan=%, ajeno=%, admin=%)', p.id, cap, aj, adm;
  end if;

  -- ===== CAPITÁN DEL PARTIDO =====
  perform set_config('request.jwt.claims', json_build_object('sub',cap,'role','authenticated')::text, true);
  perform set_config('role','authenticated', true);
  begin insert into mensajes_partido(partido_id, autor_usuario, contenido) values (p.id, public.mi_usuario(), 'test'); r:=r||' | CAP chatea en su partido: ok'; exception when others then r:=r||' | CAP chatea: ERROR '||sqlerrm; end;
  begin insert into reportes_resultado(partido_id, torneo_id, autor_usuario, es_admin, mensaje) values (p.id, p.torneo_id, public.mi_usuario(), false, 'test'); r:=r||' | CAP reporta resultado: ok'; exception when others then r:=r||' | CAP reporta: ERROR '||sqlerrm; end;
  begin insert into reportes_resultado(partido_id, torneo_id, autor_usuario, es_admin, mensaje) values (p.id, p.torneo_id, public.mi_usuario(), true, 'test'); r:=r||' | CAP reporta como admin: PERMITIDO(MAL)'; exception when others then r:=r||' | CAP reporta como admin: bloqueado'; end;
  select count(*) into n from reportes_resultado where partido_id = p.id; r:=r||' | CAP ve reportes de su partido='||n;
  update reportes_resultado set leido = true where partido_id = p.id; get diagnostics n=row_count; r:=r||' | CAP marca reportes leidos filas='||n;

  -- ===== JUGADOR AJENO AL PARTIDO =====
  perform set_config('request.jwt.claims', json_build_object('sub',aj,'role','authenticated')::text, true);
  select count(*) into n from reportes_resultado where partido_id = p.id; r:=r||' | AJ ve reportes ajenos='||n;
  select count(*) into n from mensajes_partido where partido_id = p.id; r:=r||' | AJ ve chat ajeno='||n;
  begin insert into reportes_resultado(partido_id, torneo_id, autor_usuario, es_admin, mensaje) values (p.id, p.torneo_id, public.mi_usuario(), false, 'test'); r:=r||' | AJ reporta en partido ajeno: PERMITIDO(MAL)'; exception when others then r:=r||' | AJ reporta en partido ajeno: bloqueado'; end;
  begin insert into mensajes_partido(partido_id, autor_usuario, contenido) values (p.id, public.mi_usuario(), 'test'); r:=r||' | AJ chatea en partido ajeno: PERMITIDO(MAL)'; exception when others then r:=r||' | AJ chatea en partido ajeno: bloqueado'; end;
  select count(*) into n from amigos where public.mi_usuario() not in (usuario_solicitante, usuario_receptor); r:=r||' | AJ ve amistades ajenas='||n;
  update amigos set estado = 'aceptada' where usuario_receptor <> public.mi_usuario(); get diagnostics n=row_count; r:=r||' | AJ acepta solicitudes ajenas filas='||n;
  begin insert into amigos(usuario_solicitante, usuario_receptor, estado) values ('otro_x', public.mi_usuario(), 'pendiente'); r:=r||' | AJ pide amistad en nombre de otro: PERMITIDO(MAL)'; exception when others then r:=r||' | AJ pide amistad en nombre de otro: bloqueado'; end;
  begin insert into amigos(usuario_solicitante, usuario_receptor, estado) values (public.mi_usuario(), 'otro_x', 'aceptada'); r:=r||' | AJ se auto-acepta amistad: PERMITIDO(MAL)'; exception when others then r:=r||' | AJ se auto-acepta amistad: bloqueado'; end;
  begin insert into amigos(usuario_solicitante, usuario_receptor, estado) values (public.mi_usuario(), 'otro_x', 'pendiente'); r:=r||' | AJ pide amistad: ok'; exception when others then r:=r||' | AJ pide amistad: ERROR '||sqlerrm; end;
  begin insert into notificaciones(usuario, tipo, titulo, link) values ('otro_x', 'x', 'x', 'https://pagina-falsa.com'); r:=r||' | AJ notif con link externo: PERMITIDO(MAL)'; exception when others then r:=r||' | AJ notif con link externo: bloqueado'; end;
  begin insert into notificaciones(usuario, tipo, titulo, link) values ('otro_x', 'x', 'x', '/mensajes'); r:=r||' | AJ notif con link interno: ok'; exception when others then r:=r||' | AJ notif interna: ERROR '||sqlerrm; end;
  begin update notificaciones set titulo = 'hack' where usuario = public.mi_usuario(); r:=r||' | AJ edita texto de notif: PERMITIDO(MAL)'; exception when others then r:=r||' | AJ edita texto de notif: bloqueado'; end;
  begin update notificaciones set leida = leida where usuario = public.mi_usuario(); get diagnostics n=row_count; r:=r||' | AJ marca sus notifs leidas: ok filas='||n; exception when others then r:=r||' | AJ marca leidas: ERROR '||sqlerrm; end;
  select count(*) into n from finanzas_historial; r:=r||' | AJ ve finanzas='||n;
  begin insert into finanzas_historial(periodo) values ('hack'); r:=r||' | AJ guarda finanzas: PERMITIDO(MAL)'; exception when others then r:=r||' | AJ guarda finanzas: bloqueado'; end;

  -- ===== ADMIN =====
  perform set_config('request.jwt.claims', json_build_object('sub',adm,'role','authenticated')::text, true);
  select count(*) into n from reportes_resultado; r:=r||' | ADM ve reportes='||n;
  update reportes_resultado set leido = leido; get diagnostics n=row_count; r:=r||' | ADM marca reportes filas='||n;
  select count(*) into n from mensajes_partido where partido_id = p.id; r:=r||' | ADM ve chat del partido='||n;
  begin insert into notificaciones(usuario, tipo, titulo, link) values ('otro_x', 'x', 'x', 'https://chat.whatsapp.com/x'); r:=r||' | ADM notif con link de WhatsApp: ok'; exception when others then r:=r||' | ADM notif WhatsApp: ERROR '||sqlerrm; end;
  begin insert into finanzas_historial(periodo) values ('prueba'); r:=r||' | ADM guarda historial finanzas: ok'; exception when others then r:=r||' | ADM guarda finanzas: ERROR '||sqlerrm; end;
  select count(*) into n from finanzas_historial; r:=r||' | ADM ve historial finanzas='||n;

  raise exception 'RESULTADOS%', r;  -- fuerza que se deshaga todo
end $$;
