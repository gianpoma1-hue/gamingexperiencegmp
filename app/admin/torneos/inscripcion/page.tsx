"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { datosPago } from "@/lib/paymentInfo";

type Torneo = {
  id: string;
  nombre: string;
  juego: string;
  plataforma: string;
  premio: number;
  inscripcion: number;
  fecha: string;
  jugadores_max: number;
  inscritos: number;
};

type Perfil = {
  nombre: string;
  usuario: string;
  plataforma: string;
};

type EstadoPago = "pendiente" | "confirmado" | "rechazado" | null;

export default function InscripcionPage() {
  const router = useRouter();
  const params = useParams();
  const { user, loading: authLoading } = useAuth();

  const torneoId = params.id as string;

  const [torneo, setTorneo] = useState<Torneo | null>(null);
  const [perfil, setPerfil] = useState<Perfil | null>(null);

  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [yaInscripto, setYaInscripto] = useState(false);
  const [estadoPago, setEstadoPago] = useState<EstadoPago>(null);

  const [paso, setPaso] = useState<"revisar" | "pago">("revisar");

  useEffect(() => {
    if (!authLoading) {
      cargarDatos();
    }
  }, [authLoading]);

  async function cargarDatos() {
    if (!user) {
      alert("Debés iniciar sesión para inscribirte.");
      router.push("/login");
      return;
    }

    const { data: torneoData, error: torneoError } = await supabase
      .from("torneos")
      .select("*")
      .eq("id", torneoId)
      .single();

    if (torneoError || !torneoData) {
      setLoading(false);
      return;
    }

    const { count } = await supabase
      .from("inscripciones")
      .select("*", {
        count: "exact",
        head: true,
      })
      .eq("torneo_id", torneoId);

    const inscritos = count || 0;

    if (inscritos >= torneoData.jugadores_max) {
      alert("Este torneo ya está completo.");
      router.push("/torneos");
      return;
    }

    const { data: perfilData, error: perfilError } = await supabase
      .from("usuarios")
      .select("nombre, usuario, plataforma")
      .eq("id", user.id)
      .single();

    if (perfilError || !perfilData) {
      alert("No se encontró tu perfil.");
      router.push("/");
      return;
    }

    setPerfil(perfilData);

    const { data: existe } = await supabase
      .from("inscripciones")
      .select("id, estado_pago")
      .eq("torneo_id", torneoId)
      .eq("usuario", perfilData.usuario)
      .maybeSingle();

    if (existe) {
      setYaInscripto(true);
      setEstadoPago((existe.estado_pago as EstadoPago) ?? "pendiente");
    }

    setTorneo({
      ...torneoData,
      inscritos,
    });

    setLoading(false);
  }

  async function confirmarTransferencia() {
    if (!torneo || !perfil || !user) return;

    setGuardando(true);

    const { error } = await supabase
      .from("inscripciones")
      .insert({
        torneo_id: torneo.id,
        nombre: perfil.nombre,
        usuario: perfil.usuario,
        plataforma: perfil.plataforma,
        estado_pago: "pendiente",
      });

    setGuardando(false);

    if (error) {
      if (error.code === "23505") {
        alert("Ya estás inscripto en este torneo.");
        setYaInscripto(true);
        return;
      }

      alert(error.message);
      return;
    }

    setYaInscripto(true);
    setEstadoPago("pendiente");
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#090909] text-white">
        <Navbar />
        <div className="pt-40 text-center text-xl">
          Cargando...
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#090909] text-white">
      <Navbar />

      <div className="max-w-xl mx-auto pt-36 pb-20 px-6">

        <h1 className="text-4xl font-black mb-2">
          Inscripción
        </h1>

        <p className="text-zinc-400 mb-1">
          {torneo?.nombre}
        </p>

        <p className="text-red-500 font-bold mb-8">
          Jugadores: {torneo?.inscritos} / {torneo?.jugadores_max}
        </p>

        {yaInscripto ? (
          <div className="rounded-xl border border-zinc-700 bg-zinc-900 p-6 space-y-4">
            {estadoPago === "confirmado" && (
              <>
                <p className="text-2xl">✅</p>
                <p className="font-bold text-lg text-green-400">
                  ¡Inscripción confirmada!
                </p>
                <p className="text-zinc-400">
                  Tu pago fue verificado. Ya estás dentro del torneo.
                </p>
              </>
            )}

            {estadoPago === "pendiente" && (
              <>
                <p className="text-2xl">⏳</p>
                <p className="font-bold text-lg text-yellow-400">
                  Pago en revisión
                </p>
                <p className="text-zinc-400">
                  Registramos tu transferencia. La organización va a
                  confirmar tu pago y tu cupo va a quedar reservado en
                  cuanto lo verifique.
                </p>
              </>
            )}

            {estadoPago === "rechazado" && (
              <>
                <p className="text-2xl">⚠️</p>
                <p className="font-bold text-lg text-red-500">
                  No pudimos confirmar tu pago
                </p>
                <p className="text-zinc-400">
                  Contactá a la organización para resolverlo.
                </p>
              </>
            )}
          </div>
        ) : (paso === "revisar" ? (
          <>
            <div className="rounded-xl border border-zinc-700 bg-zinc-900 p-6 space-y-4 mb-8">

              <div>
                <p className="text-zinc-400 text-sm">Nombre</p>
                <p className="font-bold text-lg">{perfil?.nombre}</p>
              </div>

              <div>
                <p className="text-zinc-400 text-sm">Usuario</p>
                <p className="font-bold text-lg">{perfil?.usuario}</p>
              </div>

              <div>
                <p className="text-zinc-400 text-sm">Plataforma</p>
                <p className="font-bold text-lg">{perfil?.plataforma}</p>
              </div>

              <div>
                <p className="text-zinc-400 text-sm">Monto de inscripción</p>
                <p className="font-bold text-lg text-red-500">
                  ${torneo?.inscripcion?.toLocaleString("es-AR")}
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <button
                type="button"
                className="w-full rounded-xl bg-red-500 px-5 py-3 font-semibold text-black transition hover:bg-red-400"
                onClick={() => setPaso("pago")}
              >
                Continuar al pago
              </button>
            </div>
          </>
        ) : (
          <div className="rounded-xl border border-zinc-700 bg-zinc-900 p-6">
            <p className="text-zinc-400">
              Sigue las instrucciones de pago para finalizar la inscripción.
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}
