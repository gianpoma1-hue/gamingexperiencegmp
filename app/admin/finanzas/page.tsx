"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { supabase } from "@/lib/supabase";

type Egreso = {
  id: string;
  concepto: string;
  monto: number;
  created_at: string;
};

type CierreHistorial = {
  id: string;
  periodo: string;
  ingresos_confirmados: number;
  egresos_totales: number;
  balance: number;
  created_at: string;
};

function nombrePeriodoActual() {
  const meses = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
  ];
  const ahora = new Date();
  return `${meses[ahora.getMonth()]} ${ahora.getFullYear()}`;
}

export default function AdminFinanzasPage() {
  const [loading, setLoading] = useState(true);

  const [ingresosConfirmados, setIngresosConfirmados] = useState(0);
  const [ingresosPendientes, setIngresosPendientes] = useState(0);
  const [egresos, setEgresos] = useState<Egreso[]>([]);

  const [concepto, setConcepto] = useState("");
  const [monto, setMonto] = useState("");
  const [guardando, setGuardando] = useState(false);

  const [historial, setHistorial] = useState<CierreHistorial[]>([]);
  const [reseteando, setReseteando] = useState(false);

  useEffect(() => {
    cargarDatos();
  }, []);

  async function cargarDatos() {
    setLoading(true);

    const { data: inscripciones } = await supabase
      .from("inscripciones")
      .select("estado_pago, archivado_finanzas, torneos(inscripcion)")
      .eq("archivado_finanzas", false);

    let confirmados = 0;
    let pendientes = 0;

    (inscripciones || []).forEach((i: any) => {
      const torneoRelacionado = Array.isArray(i.torneos)
        ? i.torneos[0]
        : i.torneos;

      const monto = torneoRelacionado?.inscripcion ?? 0;

      if (i.estado_pago === "confirmado") {
        confirmados += monto;
      } else if (i.estado_pago === "pendiente") {
        pendientes += monto;
      }
    });

    setIngresosConfirmados(confirmados);
    setIngresosPendientes(pendientes);

    const { data: egresosData } = await supabase
      .from("egresos")
      .select("*")
      .order("created_at", { ascending: false });

    setEgresos((egresosData as Egreso[]) || []);

    const { data: historialData } = await supabase
      .from("finanzas_historial")
      .select("*")
      .order("created_at", { ascending: false });

    setHistorial((historialData as CierreHistorial[]) || []);

    setLoading(false);
  }

  async function agregarEgreso() {
    if (!concepto.trim() || !monto || isNaN(Number(monto))) {
      alert("Completá el concepto y un monto válido.");
      return;
    }

    setGuardando(true);

    const { error } = await supabase.from("egresos").insert({
      concepto: concepto.trim(),
      monto: Number(monto),
    });

    setGuardando(false);

    if (error) {
      alert("No se pudo guardar: " + error.message);
      return;
    }

    setConcepto("");
    setMonto("");
    cargarDatos();
  }

  async function eliminarEgreso(id: string) {
    const confirmar = confirm("¿Eliminar este egreso?");
    if (!confirmar) return;

    await supabase.from("egresos").delete().eq("id", id);
    cargarDatos();
  }

  async function resetearFinanzas() {
    const confirmarReset = confirm(
      `¿Seguro que querés resetear las finanzas?\n\n` +
      `Ingresos confirmados: ${formatear(ingresosConfirmados)}\n` +
      `Egresos totales: ${formatear(totalEgresos)}\n` +
      `Balance: ${formatear(balance)}\n\n` +
      `Esto pone todo en $0 para empezar un nuevo período.`
    );

    if (!confirmarReset) return;

    const guardarEnHistorial = confirm(
      `¿Querés guardar este período en el historial antes de resetear?\n\n` +
      `Aceptar = Sí, guardar (usalo cuando cierre un mes real)\n` +
      `Cancelar = No guardar (usalo si son datos de prueba)`
    );

    setReseteando(true);

    if (guardarEnHistorial) {
      const { error: errorHistorial } = await supabase
        .from("finanzas_historial")
        .insert({
          periodo: nombrePeriodoActual(),
          ingresos_confirmados: ingresosConfirmados,
          egresos_totales: totalEgresos,
          balance: balance,
        });

      if (errorHistorial) {
        alert("No se pudo guardar el historial: " + errorHistorial.message);
        setReseteando(false);
        return;
      }
    }

    const { error: errorInscripciones } = await supabase
      .from("inscripciones")
      .update({ archivado_finanzas: true })
      .eq("estado_pago", "confirmado")
      .eq("archivado_finanzas", false);

    if (errorInscripciones) {
      alert("No se pudieron archivar los ingresos: " + errorInscripciones.message);
      setReseteando(false);
      return;
    }

    const { error: errorEgresos } = await supabase
      .from("egresos")
      .delete()
      .gte("created_at", "1900-01-01");

    if (errorEgresos) {
      alert("No se pudieron borrar los egresos: " + errorEgresos.message);
      setReseteando(false);
      return;
    }

    setReseteando(false);
    alert(
      guardarEnHistorial
        ? "Finanzas reseteadas y período guardado en el historial."
        : "Finanzas reseteadas (sin guardar en el historial)."
    );

    cargarDatos();
  }

  const totalEgresos = egresos.reduce((acc, e) => acc + Number(e.monto), 0);
  const balance = ingresosConfirmados - totalEgresos;

  function formatear(numero: number) {
    return `$${numero.toLocaleString("es-AR")}`;
  }

  return (
    <>
      <Navbar />

      <div className="flex min-h-screen bg-black text-white pt-20">
        <AdminSidebar />

        <main className="flex-1 p-10">

          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-4xl font-black">Finanzas</h1>
              <p className="text-zinc-400 mt-2">
                Plata que entra por inscripciones confirmadas y plata que sale
                (premios, reembolsos, gastos).
              </p>
            </div>

            <button
              onClick={resetearFinanzas}
              disabled={reseteando || loading}
              className="bg-zinc-900 border border-zinc-700 hover:border-red-600 disabled:opacity-60 px-5 py-3 rounded-xl font-bold whitespace-nowrap"
            >
              {reseteando ? "Reseteando..." : "🔄 Resetear Finanzas"}
            </button>
          </div>

          {loading ? (
            <p className="text-zinc-400 mt-10">Cargando...</p>
          ) : (
            <>
              <div className="grid md:grid-cols-4 gap-5 mt-8">

                <div className="bg-green-950/40 border border-green-700 rounded-2xl p-6">
                  <p className="text-green-400 text-sm font-semibold">
                    Ingresos confirmados
                  </p>
                  <p className="text-3xl font-black mt-2">
                    {formatear(ingresosConfirmados)}
                  </p>
                </div>

                <div className="bg-yellow-950/40 border border-yellow-700 rounded-2xl p-6">
                  <p className="text-yellow-400 text-sm font-semibold">
                    Pendientes de confirmar
                  </p>
                  <p className="text-3xl font-black mt-2">
                    {formatear(ingresosPendientes)}
                  </p>
                </div>

                <div className="bg-red-950/40 border border-red-700 rounded-2xl p-6">
                  <p className="text-red-400 text-sm font-semibold">
                    Egresos totales
                  </p>
                  <p className="text-3xl font-black mt-2">
                    {formatear(totalEgresos)}
                  </p>
                </div>

                <div
                  className={`rounded-2xl p-6 border ${
                    balance >= 0
                      ? "bg-zinc-900 border-zinc-700"
                      : "bg-red-950/40 border-red-700"
                  }`}
                >
                  <p className="text-zinc-400 text-sm font-semibold">
                    Balance
                  </p>
                  <p className="text-3xl font-black mt-2">
                    {formatear(balance)}
                  </p>
                </div>

              </div>

              <div className="mt-10 bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                <h2 className="text-xl font-bold mb-4">
                  Registrar un egreso
                </h2>

                <div className="flex flex-col md:flex-row gap-4">
                  <input
                    value={concepto}
                    onChange={(e) => setConcepto(e.target.value)}
                    placeholder="Concepto (ej: Premio Torneo KIDDO)"
                    className="flex-1 rounded-xl bg-black border border-zinc-700 px-4 py-3 outline-none focus:border-red-600"
                  />

                  <input
                    value={monto}
                    onChange={(e) => setMonto(e.target.value)}
                    placeholder="Monto"
                    type="number"
                    className="w-full md:w-48 rounded-xl bg-black border border-zinc-700 px-4 py-3 outline-none focus:border-red-600"
                  />

                  <button
                    onClick={agregarEgreso}
                    disabled={guardando}
                    className="bg-red-600 hover:bg-red-700 disabled:opacity-60 px-6 py-3 rounded-xl font-bold whitespace-nowrap"
                  >
                    {guardando ? "Guardando..." : "+ Agregar"}
                  </button>
                </div>
              </div>

              <div className="mt-8">
                <h2 className="text-xl font-bold mb-4">
                  Historial de egresos
                </h2>

                {egresos.length === 0 ? (
                  <p className="text-zinc-500">
                    Todavía no cargaste ningún egreso.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {egresos.map((e) => (
                      <div
                        key={e.id}
                        className="bg-zinc-900 border border-zinc-800 rounded-xl px-6 py-4 flex items-center justify-between"
                      >
                        <div>
                          <p className="font-semibold">{e.concepto}</p>
                          <p className="text-zinc-500 text-sm mt-1">
                            {new Date(e.created_at).toLocaleString("es-AR")}
                          </p>
                        </div>

                        <div className="flex items-center gap-5">
                          <span className="font-bold text-red-400">
                            -{formatear(Number(e.monto))}
                          </span>

                          <button
                            onClick={() => eliminarEgreso(e.id)}
                            className="text-zinc-500 hover:text-red-500 text-sm"
                          >
                            Eliminar
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-10">
                <h2 className="text-xl font-bold mb-4">
                  Historial de cierres
                </h2>

                {historial.length === 0 ? (
                  <p className="text-zinc-500">
                    Todavía no cerraste ningún período.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {historial.map((h) => (
                      <div
                        key={h.id}
                        className="bg-zinc-900 border border-zinc-800 rounded-xl px-6 py-4 flex items-center justify-between flex-wrap gap-3"
                      >
                        <div>
                          <p className="font-semibold">{h.periodo}</p>
                          <p className="text-zinc-500 text-sm mt-1">
                            Cerrado el{" "}
                            {new Date(h.created_at).toLocaleString("es-AR")}
                          </p>
                        </div>

                        <div className="flex items-center gap-6 text-sm">
                          <span className="text-green-400 font-semibold">
                            Ingresos: {formatear(h.ingresos_confirmados)}
                          </span>
                          <span className="text-red-400 font-semibold">
                            Egresos: {formatear(h.egresos_totales)}
                          </span>
                          <span className="font-bold">
                            Balance: {formatear(h.balance)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

        </main>
      </div>
    </>
  );
}
