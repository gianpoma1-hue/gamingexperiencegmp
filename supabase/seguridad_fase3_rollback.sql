-- Rollback de la fase 3. Deshace el paso B (vuelve a exponer emails e inscripciones).
-- Las funciones del paso A pueden quedar: no abren nada y el código nuevo las usa.

drop policy "Cada usuario ve sus inscripciones" on public.inscripciones;
create policy "Public Select" on public.inscripciones for select to public using (true);

grant select on public.usuarios to anon, authenticated;
