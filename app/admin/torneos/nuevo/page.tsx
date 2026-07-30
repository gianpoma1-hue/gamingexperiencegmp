"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import Navbar from "@/components/layout/Navbar";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { supabase } from "@/lib/supabase";
import { juegos } from "@/lib/games";

const JUEGOS_CON_EQUIPO = [
  "EA SPORTS FC 26",
  "Rocket League",
  "Truco Blyts",
];

const OPCIONES_JUGADORES = [2,4,8,16,32,64];
const OPCIONES_EQUIPOS = [2,4,8,16,32];

export default function NuevoTorneoPage() {
  const router = useRouter();

  const [guardando, setGuardando] = useState(false);

  const [nombre, setNombre] = useState("");
  const [juego, setJuego] = useState(juegos[0].nombre);
  const [modalidad, setModalidad] = useState<"individual" | "equipo">(
    "individual"
  );
  const [plataforma, setPlataforma] = useState("Multiplataforma");
  const [jugadoresMax, setJugadoresMax] = useState(16);
  const [premio, setPremio] = useState("");
  const [premioSegundo, setPremioSegundo] = useState("");
  const [inscripcion, setInscripcion] = useState("");
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [estado] = useState("Abierto");

  const permiteEquipo = JUEGOS_CON_EQUIPO.includes(juego);

  function cambiarJuego(nuevoJuego: string) {
    setJuego(nuevoJuego);

    if (!JUEGOS_CON_EQUIPO.includes(nuevoJuego)) {
      setModalidad("individual");
    }
  }

  async function crearTorneo() {
    if (
      !nombre ||
      !premio ||
      !inscripcion ||
      !fecha ||
      !hora
    ) {
      alert("Completá todos los campos obligatorios.");
      return;
    }

    setGuardando(true);

    const { error } = await supabase
      .from("torneos")
      .insert({
        nombre,
        juego,
        modalidad,
        plataforma,
        jugadores_max: jugadoresMax,
        premio: Number(premio),
        premio_segundo: Number(premioSegundo) || 0,
        inscripcion: Number(inscripcion),
        fecha,
        hora,
        descripcion,
        estado,
      });

    setGuardando(false);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Torneo creado correctamente.");

    router.push("/admin/torneos");
  }
    return (
    <main className="min-h-screen bg-black text-white">

      <Navbar />

      <div className="flex pt-20">

        <AdminSidebar />

        <div className="flex-1 p-10">

          <h1 className="text-5xl font-black">
            Nuevo Torneo
          </h1>

          <p className="text-zinc-400 mt-3 mb-10">
            Creá un nuevo torneo.
          </p>

          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-10">

            <div className="grid md:grid-cols-2 gap-8">

              <div>

                <label className="block mb-3 font-bold">
                  Nombre del torneo
                </label>

                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="w-full bg-black border border-zinc-700 rounded-xl p-4"
                />

              </div>

              <div>

                <label className="block mb-3 font-bold">
                  Juego
                </label>

                <select
                  value={juego}
                  onChange={(e) => cambiarJuego(e.target.value)}
                  className="w-full bg-black border border-zinc-700 rounded-xl p-4"
                >
                  {juegos.map((j) => (
                    <option key={j.id} value={j.nombre}>
                      {j.nombre}
                    </option>
                  ))}
                </select>

              </div>

              <div>

                <label className="block mb-3 font-bold">
                  Modalidad
                </label>

                <select
                  value={modalidad}
                  onChange={(e) =>
                    setModalidad(e.target.value as "individual" | "equipo")
                  }
                  className="w-full bg-black border border-zinc-700 rounded-xl p-4"
                >
                  <option value="individual">Individual (1v1)</option>

                  {permiteEquipo && (
                    <option value="equipo">En equipo (2v2)</option>
                  )}
                </select>

                {!permiteEquipo && (
                  <p className="text-xs text-zinc-500 mt-2">
                    El modo por equipos (2v2) solo está disponible para EA
                    SPORTS FC 26, Rocket League y Truco Blyts.
                  </p>
                )}

              </div>

              <div>

                <label className="block mb-3 font-bold">
                  Plataforma
                </label>

                <select
                  value={plataforma}
                  onChange={(e) => setPlataforma(e.target.value)}
                  className="w-full bg-black border border-zinc-700 rounded-xl p-4"
                >
                  <option>Multiplataforma</option>
                  <option>PlayStation 5</option>
                  <option>Xbox Series X/S</option>
                  <option>PC</option>
                  <option>Mobile / Celular</option>
                </select>

              </div>

              <div>

                <label className="block mb-3 font-bold">
                  {modalidad === "equipo" ? "Cantidad de equipos" : "Cantidad de jugadores"}
                </label>

                <select
                  value={jugadoresMax}
                  onChange={(e) =>
                    setJugadoresMax(Number(e.target.value))
                  }
                  className="w-full bg-black border border-zinc-700 rounded-xl p-4"
                >
                  {(modalidad === "equipo" ? OPCIONES_EQUIPOS : OPCIONES_JUGADORES).map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>

              </div>

              <div>

                <label className="block mb-3 font-bold">
                  Premio 1er puesto
                </label>

                <input
                  type="number"
                  value={premio}
                  onChange={(e) => setPremio(e.target.value)}
                  className="w-full bg-black border border-zinc-700 rounded-xl p-4"
                />

              </div>

              <div>

                <label className="block mb-3 font-bold">
                  Premio 2do puesto <span className="text-zinc-500 font-normal">(opcional)</span>
                </label>

                <input
                  type="number"
                  value={premioSegundo}
                  onChange={(e) => setPremioSegundo(e.target.value)}
                  className="w-full bg-black border border-zinc-700 rounded-xl p-4"
                />

              </div>

              <div>

                <label className="block mb-3 font-bold">
                  Costo de inscripción
                </label>

                <input
                  type="number"
                  value={inscripcion}
                  onChange={(e) => setInscripcion(e.target.value)}
                  className="w-full bg-black border border-zinc-700 rounded-xl p-4"
                />

              </div>

              <div>

                <label className="block mb-3 font-bold">
                  Fecha
                </label>

                <input
                  type="date"
                  value={fecha}
                  onChange={(e) => setFecha(e.target.value)}
                  className="w-full bg-black border border-zinc-700 rounded-xl p-4"
                />

              </div>

              <div>

                <label className="block mb-3 font-bold">
                  Hora
                </label>

                <input
                  type="time"
                  value={hora}
                  onChange={(e) => setHora(e.target.value)}
                  className="w-full bg-black border border-zinc-700 rounded-xl p-4"
                />

              </div>

            </div>

            <div className="mt-8">

              <label className="block mb-3 font-bold">
                Descripción
              </label>

              <textarea
                rows={6}
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                className="w-full bg-black border border-zinc-700 rounded-xl p-4 resize-none"
              />

            </div>

            <div className="flex justify-end gap-5 mt-10">

              <button
                onClick={() => router.back()}
                className="border border-zinc-700 px-8 py-4 rounded-xl"
              >
                Cancelar
              </button>

              <button
                onClick={crearTorneo}
                disabled={guardando}
                className="bg-red-600 hover:bg-red-700 px-8 py-4 rounded-xl font-bold disabled:bg-zinc-700"
              >
                {guardando ? "Creando..." : "Crear Torneo"}
              </button>

            </div>

          </div>

        </div>

      </div>

    </main>
  );
}
