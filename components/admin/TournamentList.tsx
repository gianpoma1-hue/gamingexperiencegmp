import TournamentCard from "./TournamentCard";

export default function TournamentList() {
  const torneos = [
    {
      nombre: "GMP CUP #1",
      juego: "EA SPORTS FC 26",
      fecha: "20/07/2026 - 21:00",
      jugadores: "8 / 16",
      premio: "$100.000",
      estado: "Abierto" as const,
    },
    {
      nombre: "GMP CUP #2",
      juego: "EA SPORTS FC 26",
      fecha: "27/07/2026 - 21:00",
      jugadores: "16 / 16",
      premio: "$150.000",
      estado: "Cerrado" as const,
    },
    {
      nombre: "GMP CUP #3",
      juego: "EA SPORTS FC 26",
      fecha: "03/08/2026 - 21:00",
      jugadores: "3 / 16",
      premio: "$80.000",
      estado: "Abierto" as const,
    },
  ];

  return (
    <div className="space-y-8">

      {torneos.map((torneo, index) => (

        <TournamentCard
          key={index}
          nombre={torneo.nombre}
          juego={torneo.juego}
          fecha={torneo.fecha}
          jugadores={torneo.jugadores}
          premio={torneo.premio}
          estado={torneo.estado}
        />

      ))}

    </div>
  );
}