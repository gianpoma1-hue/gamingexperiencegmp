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
    id: "ea-fc",
    nombre: "EA SPORTS FC 26",
    imagen: "/images/games/ea-fc.jpg",
    disponible: true,
    ruta: "/torneos/ea-fc",
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
    disponible: false,
    ruta: "/torneos/proximamente",
    modalidad: "individual",  },
  {
    id: "cs2",
    nombre: "Counter-Strike 2",
    imagen: "/images/games/cs2.jpg",
    disponible: false,
    ruta: "/torneos/proximamente",
  },
];
