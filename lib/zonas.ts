// Formato especial para torneos de 6 equipos:
//   - Fase de zonas: 2 zonas de 3 equipos. Todos contra todos (2 partidos por equipo, BO1).
//   - Clasifican los 2 primeros de cada zona.
//   - Semifinales (1° de una zona vs 2° de la otra) y final.
//
// Cómo se guardan los partidos (sin columnas nuevas en la base):
//   ronda 1  -> zonas.  numero_partido 1 a 3 = Zona A, 4 a 6 = Zona B
//   ronda 2  -> semifinales (numero_partido 1 y 2)
//   ronda 3  -> final
//
// Criterios de posición: 1) partidos ganados, 2) diferencia de rondas,
// 3) rondas ganadas en total. Si sigue el empate, lo define la organización
// con una partida de desempate.

export const EQUIPOS_FORMATO_ZONAS = 6;

export function esFormatoZonas(jugadoresMax?: number | null) {
  return jugadoresMax === EQUIPOS_FORMATO_ZONAS;
}

export type Zona = "A" | "B";

export function zonaDelPartido(numeroPartido: number): Zona {
  return numeroPartido <= 3 ? "A" : "B";
}

// Fecha 1, 2 o 3 dentro de la zona
export function fechaDelPartido(numeroPartido: number) {
  return ((numeroPartido - 1) % 3) + 1;
}

export type PartidoZona = {
  ronda: number;
  numero_partido: number;
  jugador1: string | null;
  jugador2: string | null;
  capitan1?: string | null;
  capitan2?: string | null;
  goles_jugador1: number | null;
  goles_jugador2: number | null;
  ganador?: string | null;
};

export type FilaTabla = {
  equipo: string;
  pj: number; // partidos jugados
  pg: number; // partidos ganados
  pp: number; // partidos perdidos
  rf: number; // rondas a favor
  rc: number; // rondas en contra
  dif: number; // diferencia de rondas
};

export type TablaZona = {
  zona: Zona;
  filas: FilaTabla[];
  completa: boolean; // ya se jugaron los 3 partidos
  empateSinResolver: boolean; // empate total en un puesto que decide quién clasifica o cómo se cruza
};

function ordenar(a: FilaTabla, b: FilaTabla) {
  return b.pg - a.pg || b.dif - a.dif || b.rf - a.rf;
}

function empatados(a: FilaTabla, b: FilaTabla) {
  return a.pg === b.pg && a.dif === b.dif && a.rf === b.rf;
}

export function calcularTablas(partidos: PartidoZona[]): Record<Zona, TablaZona> {
  const resultado = {} as Record<Zona, TablaZona>;

  (["A", "B"] as Zona[]).forEach((zona) => {
    const delaZona = partidos.filter(
      (p) => p.ronda === 1 && zonaDelPartido(p.numero_partido) === zona
    );

    const mapa = new Map<string, FilaTabla>();
    const fila = (equipo: string) => {
      if (!mapa.has(equipo)) {
        mapa.set(equipo, { equipo, pj: 0, pg: 0, pp: 0, rf: 0, rc: 0, dif: 0 });
      }
      return mapa.get(equipo)!;
    };

    delaZona.forEach((p) => {
      if (p.jugador1) fila(p.jugador1);
      if (p.jugador2) fila(p.jugador2);
    });

    let jugados = 0;

    delaZona.forEach((p) => {
      if (!p.ganador || !p.jugador1 || !p.jugador2) return;
      jugados++;

      const f1 = fila(p.jugador1);
      const f2 = fila(p.jugador2);
      const g1 = p.goles_jugador1 ?? 0;
      const g2 = p.goles_jugador2 ?? 0;

      f1.pj++; f2.pj++;
      f1.rf += g1; f1.rc += g2;
      f2.rf += g2; f2.rc += g1;

      if (p.ganador === p.jugador1) { f1.pg++; f2.pp++; }
      else { f2.pg++; f1.pp++; }
    });

    const filas = Array.from(mapa.values());
    filas.forEach((f) => { f.dif = f.rf - f.rc; });
    filas.sort(ordenar);

    const completa = delaZona.length === 3 && jugados === 3;

    // Si 1° y 2° (o 2° y 3°) quedan igualados en todo, hace falta desempate
    let empateSinResolver = false;
    if (completa && filas.length === 3) {
      empateSinResolver =
        empatados(filas[0], filas[1]) || empatados(filas[1], filas[2]);
    }

    resultado[zona] = { zona, filas, completa, empateSinResolver };
  });

  return resultado;
}

// Devuelve los cruces de semifinales cuando ambas zonas están completas y sin empates.
export function calcularSemifinales(partidos: PartidoZona[]) {
  const t = calcularTablas(partidos);

  if (!t.A.completa || !t.B.completa) return null;
  if (t.A.empateSinResolver || t.B.empateSinResolver) return null;

  const primeroA = t.A.filas[0].equipo;
  const segundoA = t.A.filas[1].equipo;
  const primeroB = t.B.filas[0].equipo;
  const segundoB = t.B.filas[1].equipo;

  return [
    { numero: 1, jugador1: primeroA, jugador2: segundoB },
    { numero: 2, jugador1: primeroB, jugador2: segundoA },
  ];
}
