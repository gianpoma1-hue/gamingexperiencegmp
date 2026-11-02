export type Game = {
  id: string;
  nombre: string;
  imagen: string;
  disponible: boolean;
  ruta: string;
  modalidad: "individual" | "equipo";
};

export const juegos: Game[] = [
  {
    id: "ea-fc-27",
    nombre: "EA SPORTS FC 27",
    imagen: "/images/games/ea-fc-27.jpg",
    disponible: true,
    ruta: "/torneos/ea-fc-27",
    modalidad: "individual",
  },
  {
    id: "fortnite",
    nombre: "Fortnite",
    imagen: "/images/games/fortnite.jpg",
    disponible: false,
    ruta: "/torneos/proximamente",
    modalidad: "individual",
  },
  {
    id: "rocket-league",
    nombre: "Rocket League",
    imagen: "/images/games/rocket-league.jpg",
    disponible: false,
    ruta: "/torneos/proximamente",
    modalidad: "individual",
  },
  {
    id: "truco-blyts",
    nombre: "Truco Blyts",
    imagen: "/images/games/truco-blyts.jpg",
    disponible: true,
    ruta: "/torneos/truco-blyts",
    modalidad: "equipo",
  },
  {
    id: "rainbow-six",
    nombre: "Rainbow Six Siege",
    imagen: "/images/games/rainbow-six.jpg",
    disponible: false,
    ruta: "/torneos/proximamente",
    modalidad: "individual",
  },
  {
    id: "valorant",
    nombre: "Valorant",
    imagen: "/images/games/valorant.jpg",
    disponible: false,
    ruta: "/torneos/proximamente",
    modalidad: "individual",
  },
  {
    id: "lol",
    nombre: "League of Legends",
    imagen: "/images/games/lol.jpg",
    disponible: true,
    ruta: "/torneos/league-of-legends",
    modalidad: "equipo",
  },
  {
    id: "cs2",
    nombre: "Counter-Strike 2",
    imagen: "/images/games/cs2.jpg",
    disponible: true,
    ruta: "/torneos/cs2",
    modalidad: "equipo",
  },
];

// Juegos que ya no se juegan. No aparecen en la sección de torneos ni al crear
// torneos nuevos, pero se conservan para que los torneos viejos sigan
// mostrándose bien (imagen, link de "volver", etc.).
export const juegosArchivados: Game[] = [
  {
    id: "ea-fc",
    nombre: "EA SPORTS FC 26",
    imagen: "/images/games/ea-fc.jpg",
    disponible: false,
    ruta: "/torneos",
    modalidad: "individual",
  },
];

export function buscarJuego(nombre: string): Game | undefined {
  return [...juegos, ...juegosArchivados].find((j) => j.nombre === nombre);
}

export const JUGADORES_POR_EQUIPO: Record<string, number> = {
  "EA SPORTS FC 26": 2,
  "EA SPORTS FC 27": 2,
  "League of Legends": 5,
  "Counter-Strike 2": 5,
  "Valorant": 5,
  "Rocket League": 3,
  "Truco Blyts": 2,
};

export function jugadoresPorEquipo(nombreJuego: string): number {
  return JUGADORES_POR_EQUIPO[nombreJuego] ?? 5;
}
