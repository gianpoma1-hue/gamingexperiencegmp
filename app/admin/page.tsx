"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { supabase } from "@/lib/supabase";

type Torneo = {
  id: string;
  nombre: string;
  juego: string;
  plataforma: string;
  jugadores_max: number;
  premio: number;
  inscripcion: number;
  fecha: string;
  estado: string;
};

export default function AdminTorneosPage() {
  const router = useRouter();

  const [torneos, setTorneos] = useState<Torneo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarTorneos();
  }, []);

  async function cargarTorneos() {
    const { data } = await supabase
      .from("torneos")
      .select("*")
      .order("fecha", { ascending: true });

    setTorneos(data || []);
    setLoading(false);
  }

  async function eliminarTorneo(id: string) {
    const confirmar = confirm(
      "¿Seguro que querés eliminar este torneo?"
    );

    if (!confirmar) return;

    const { error } = await supabase
      .from("torneos")
      .delete()
      .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Torneo eliminado.");

    cargarTorneos();
  }

  async function empezarTorneo(torneoId: string) {
    // Buscar inscriptos primero para poder mostrar el conteo real
    // en el aviso de confirmación.
    const { data: inscriptosPrevios, error: errorPrevio } = await supabase
      .from("inscripciones")
      .select("estado_pago")
      .eq("torneo_id", torneoId);

    if (errorPrevio) {
      alert(errorPrevio.message);
      return;
    }

    const confirmados =
      inscriptosPrevios?.filter((i) => i.estado_pago === "confirmado")
        .length ?? 0;

    const confirmar = confirm(
      `¿Querés comenzar este torneo?\n\nJugadores con pago confirmado: ${confirmados}\n\nEsta acción genera la llave y no se puede deshacer desde la web (habría que pedirle ayuda a Claude para revertirlo a mano en la base de datos).`
    );

    if (!confirmar) return;

    // Evitar iniciarlo dos veces
    const { data: existentes } = await supabase
      .from("partidos")
      .select("id")
      .eq("torneo_id", torneoId)
      .limit(1);

    if (existentes && existentes.length > 0) {
      alert("Este torneo ya fue iniciado.");
      return;
    }

    // Saber si el torneo es individual o por equipos
    const { data: torneoData } = await supabase
      .from("torneos")
      .select("modalidad")
      .eq("id", torneoId)
      .single();

    const esPorEquipos = torneoData?.modalidad === "equipo";

    // Buscar inscriptos
    const { data: inscriptos, error } = await supabase
      .from("inscripciones")
      .select("*")
      .eq("torneo_id", torneoId);

    if (error) {
      alert(error.message);
      return;
    }

    if (!inscriptos || inscriptos.length < 2) {
      alert("No hay suficientes jugadores.");
      return;
    }
    const pagosSinConfirmar = inscriptos.filter(
  (i) => i.estado_pago !== "confirmado"
);

if (pagosSinConfirmar.length > 0) {
  alert(
    "No podés iniciar el torneo hasta que TODOS los pagos estén confirmados."
  );
  return;
}

  // Mezclar jugadores
const jugadores = [...inscriptos].sort(
  () => Math.random() - 0.5
);

const partidos = [];

// -------------------------
// RONDA 1
// -------------------------

for (let i = 0; i < jugadores.length; i += 2) {
  const nombreEntrante = (j: (typeof jugadores)[number] | undefined) =>
    !j ? null : esPorEquipos ? j.equipo ?? j.usuario : j.usuario;

  const capitanEntrante = (j: (typeof jugadores)[number] | undefined) =>
    j?.usuario ?? null;

  partidos.push({
    torneo_id: torneoId,
    ronda: 1,
    numero_partido: i / 2 + 1,
    jugador1: nombreEntrante(jugadores[i]),
    jugador2: nombreEntrante(jugadores[i + 1]),
    capitan1: capitanEntrante(jugadores[i]),
    capitan2: capitanEntrante(jugadores[i + 1]),
    estado: "Pendiente",
  });
}

// -------------------------
// RESTO DE RONDAS
// -------------------------

let partidosRonda = jugadores.length / 2;
let ronda = 2;

while (partidosRonda > 1) {
  partidosRonda /= 2;

  for (let i = 1; i <= partidosRonda; i++) {
    partidos.push({
      torneo_id: torneoId,
      ronda,
      numero_partido: i,
      jugador1: null,
      jugador2: null,
      capitan1: null,
      capitan2: null,
      estado: "Pendiente",
    });
  }

  ronda++;
}

    const { error: errorInsert } = await supabase
      .from("partidos")
      .insert(partidos);

    if (errorInsert) {
      alert(errorInsert.message);
      return;
    }

    await supabase
      .from("torneos")
      .update({
        estado: "En curso",
      })
      .eq("id", torneoId);

    alert("¡Torneo iniciado correctamente!");

    cargarTorneos();
  }
    return (
    <main className="min-h-screen bg-black text-white">

      <Navbar />

      <div className="flex pt-20">

        <AdminSidebar />

        <div className="flex-1 p-5 pt-20 lg:p-10">

          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8 lg:mb-10">

            <div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black">
                Torneos
              </h1>

              <p className="text-zinc-400 mt-2 text-sm sm:text-base">
                Administrá todos los torneos.
              </p>

            </div>

            <button
              onClick={() => router.push("/admin/torneos/nuevo")}
              className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-xl font-bold text-sm sm:text-base"
            >
              + Crear Torneo
            </button>

          </div>

          {loading ? (

            <p>Cargando...</p>

          ) : (

            <div className="space-y-6">

              {torneos.map((torneo) => (

                <div
                  key={torneo.id}
                  className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 sm:p-6"
                >

                  <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">

                    <div>

                      <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold">
                        {torneo.nombre}
                      </h2>

                      <p className="text-zinc-400 text-sm sm:text-base">
                        {torneo.juego}
                      </p>

                      <p className="mt-2 text-sm sm:text-base">
                        Plataforma: {torneo.plataforma}
                      </p>

                      <p className="text-sm sm:text-base">
                        Premio: ${torneo.premio}
                      </p>

                      <p className="text-sm sm:text-base">
                        Inscripción: ${torneo.inscripcion}
                      </p>

                      <p className="text-sm sm:text-base">
                        Fecha: {torneo.fecha}
                      </p>

                      <p className="mt-3 text-sm sm:text-base">
                        Estado:
                        <span className="text-red-500 font-bold ml-2">
                          {torneo.estado}
                        </span>
                      </p>

                    </div>

                    <div className="flex flex-wrap gap-2 sm:gap-3">

                      <button
                        onClick={() =>
                          router.push(`/admin/torneos/editar/${torneo.id}`)
                        }
                        className="bg-blue-600 hover:bg-blue-700 px-4 sm:px-5 py-2 rounded-lg text-sm sm:text-base"
                      >
                        Editar
                      </button>

                      <button
                        className="bg-yellow-600 hover:bg-yellow-700 px-4 sm:px-5 py-2 rounded-lg text-sm sm:text-base"
                      >
                        Cerrar
                      </button>

                     {torneo.estado === "En curso" ? (

  <button
    onClick={() => router.push(`/torneos/llave/${torneo.id}`)}
    className="bg-blue-600 hover:bg-blue-700 px-4 sm:px-5 py-2 rounded-lg text-sm sm:text-base font-semibold"
  >
    🏆 Llave del Torneo
  </button>

) : (

  <button
    onClick={() => empezarTorneo(torneo.id)}
    className="bg-green-600 hover:bg-green-700 px-4 sm:px-5 py-2 rounded-lg text-sm sm:text-base font-semibold"
  >
    Empezar
  </button>

)}

                      <button
                        onClick={() => eliminarTorneo(torneo.id)}
                        className="bg-red-700 hover:bg-red-800 px-4 sm:px-5 py-2 rounded-lg text-sm sm:text-base"
                      >
                        Eliminar
                      </button>

                    </div>

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>

      </div>

    </main>
  );
}