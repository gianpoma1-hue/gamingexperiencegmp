-- Reemplazo de equipo en un torneo ya iniciado (2026-11-06):
-- CASH CUP CS2 #2 — "ztw" (capitán LUKIMPLE) se bajó y entra "Villa San Carlos" (capitán imd).
-- Solo cambia partidos de ese torneo que todavía NO tienen resultado.

update public.partidos
set jugador1 = 'Villa San Carlos', capitan1 = 'imd'
where torneo_id = '2b529bd6-f61c-4387-a1b4-b6934e7b333c'
  and jugador1 = 'ztw' and estado <> 'Finalizado';

update public.partidos
set jugador2 = 'Villa San Carlos', capitan2 = 'imd'
where torneo_id = '2b529bd6-f61c-4387-a1b4-b6934e7b333c'
  and jugador2 = 'ztw' and estado <> 'Finalizado';

-- Verificación: tiene que mostrar 2 partidos con Villa San Carlos y ninguno con ztw.
select ronda, numero_partido, jugador1, capitan1, jugador2, capitan2, estado
from public.partidos
where torneo_id = '2b529bd6-f61c-4387-a1b4-b6934e7b333c'
  and ('ztw' in (jugador1, jugador2) or 'Villa San Carlos' in (jugador1, jugador2))
order by ronda, numero_partido;
