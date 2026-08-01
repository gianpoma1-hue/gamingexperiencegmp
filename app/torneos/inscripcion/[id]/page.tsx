"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";

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
  modalidad: "individual" | "equipo";
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
  const [equipo, setEquipo] = useState("");
  const [datosPago, setDatosPago] = useState({
    titular: "",
    cbu: "",
    alias: "",
    banco: "",
  });

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

    const { data: configData } = await supabase
      .from("configuracion_pagos")
      .select("titular, cbu, alias, banco")
      .eq("id", 1)
      .single();

    if (configData) {
      setDatosPago(configData);
    }

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
        equipo: torneo.modalidad === "equipo" ? equipo.trim() : null,
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

      <div className="max-w-xl mx-auto pt-24 lg:pt-36 pb-16 lg:pb-20 px-4 sm:px-6">

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
        ) : paso === "revisar" ? (
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

              {torneo?.modalidad === "equipo" && (
                <div>
                  <p className="text-zinc-400 text-sm">Nombre del equipo</p>
                  <input
                    type="text"
                    value={equipo}
                    onChange={(e) => setEquipo(e.target.value)}
                    placeholder="Ej: Los Cracks"
                    className="mt-1 w-full rounded-lg bg-zinc-800 border border-zinc-700 px-4 py-3 text-white font-bold outline-none focus:border-red-600"
                  />
                </div>
              )}

              <div>
                <p className="text-zinc-400 text-sm">Monto de inscripción</p>
                <p className="font-bold text-lg text-red-500">
                  ${torneo?.inscripcion?.toLocaleString("es-AR")}
                </p>
                {torneo?.modalidad === "equipo" && (
                  <p className="text-zinc-400 text-sm mt-1">
                    Este monto es único por equipo: cubre la inscripción de
                    los 2 jugadores, no se paga por separado.
                  </p>
                )}
              </div>

            </div>

            <button
              onClick={() => {
                if (
                  torneo?.modalidad === "equipo" &&
                  equipo.trim().length === 0
                ) {
                  alert("Ingresá el nombre de tu equipo para continuar.");
                  return;
                }
                setPaso("pago");
              }}
              className="w-full rounded-xl py-4 font-bold text-lg bg-red-600 hover:bg-red-700 transition"
            >
              Continuar
            </button>
          </>
        ) : (
          <>
            <div className="rounded-xl border border-red-600 bg-zinc-900 p-6 space-y-4 mb-6">

              <p className="font-bold text-lg text-white">
                Transferí ${torneo?.inscripcion?.toLocaleString("es-AR")} a:
              </p>

              {torneo?.modalidad === "equipo" && (
                <p className="text-zinc-400 text-sm -mt-2">
                  Este monto corresponde a la inscripción completa del
                  equipo "{equipo}" (vale por los 2 jugadores).
                </p>
              )}

              <div>
                <p className="text-zinc-400 text-sm">Titular</p>
                <p className="font-bold">{datosPago.titular}</p>
              </div>

              <div>
                <p className="text-zinc-400 text-sm">CBU</p>
                <p className="font-bold font-mono">{datosPago.cbu}</p>
              </div>

              <div>
                <p className="text-zinc-400 text-sm">Alias</p>
                <p className="font-bold font-mono">{datosPago.alias}</p>
              </div>

              <div>
                <p className="text-zinc-400 text-sm">Banco</p>
                <p className="font-bold">{datosPago.banco}</p>
              </div>

            </div>

            <div className="rounded-xl border border-zinc-700 bg-zinc-900/60 p-5 mb-8 text-sm text-zinc-400 leading-6">
              Si el torneo se cancela, o si al llegar el horario de inicio
              no se completa el cupo mínimo de jugadores, te devolvemos el
              dinero de la inscripción en menos de 2 horas.
            </div>

            <button
              onClick={confirmarTransferencia}
              disabled={guardando}
              className="w-full rounded-xl py-4 font-bold text-lg bg-red-600 hover:bg-red-700 transition disabled:opacity-60"
            >
              {guardando ? "Guardando..." : "Ya transferí"}
            </button>

            <button
              onClick={() => setPaso("revisar")}
              className="w-full rounded-xl py-3 mt-3 font-semibold text-zinc-400 hover:text-white transition"
            >
              Volver
            </button>
          </>
        )}

      </div>
    </main>
  );
}
