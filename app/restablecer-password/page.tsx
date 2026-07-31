"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import { supabase } from "@/lib/supabase";

export default function RestablecerPasswordPage() {
  const router = useRouter();

  const [listo, setListo] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmar, setConfirmar] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [exito, setExito] = useState(false);

  useEffect(() => {
    // Supabase toma automáticamente el token del link del mail y arma
    // una sesión temporal. Esperamos a que esa sesión esté lista antes
    // de mostrar el formulario.
    supabase.auth.getSession().then(({ data }) => {
      setListo(true);

      if (!data.session) {
        setError(
          "El link no es válido o ya venció. Pedí uno nuevo desde la pantalla anterior."
        );
      }
    });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("La contraseña tiene que tener al menos 6 caracteres.");
      return;
    }

    if (password !== confirmar) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({ password });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    setExito(true);

    setTimeout(() => {
      router.push("/login");
    }, 2500);
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />

      <div className="flex items-center justify-center min-h-screen pt-24 lg:pt-20 px-6">

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 sm:p-10 w-full max-w-md">

          <h1 className="text-2xl sm:text-3xl font-black text-center mb-8">
            Nueva Contraseña
          </h1>

          {exito ? (
            <p className="text-center text-green-400 leading-6">
              ✅ Tu contraseña se actualizó. Te llevamos al login...
            </p>
          ) : !listo ? (
            <p className="text-center text-zinc-400">Cargando...</p>
          ) : (
            <form onSubmit={handleSubmit}>
              {error && (
                <div className="mb-5 rounded-lg bg-red-600/20 border border-red-600 p-3 text-sm text-red-300">
                  {error}
                </div>
              )}

              <div className="mb-5">
                <label className="block mb-2 text-zinc-400">
                  Nueva contraseña
                </label>

                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-black border border-zinc-700 rounded-xl p-3 outline-none focus:border-red-600"
                />
              </div>

              <div className="mb-8">
                <label className="block mb-2 text-zinc-400">
                  Confirmar contraseña
                </label>

                <input
                  type="password"
                  required
                  value={confirmar}
                  onChange={(e) => setConfirmar(e.target.value)}
                  className="w-full bg-black border border-zinc-700 rounded-xl p-3 outline-none focus:border-red-600"
                />
              </div>

              <button
                disabled={loading}
                className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-60 rounded-xl py-3 font-bold transition"
              >
                {loading ? "Guardando..." : "Guardar Nueva Contraseña"}
              </button>
            </form>
          )}

        </div>

      </div>

    </main>
  );
}
