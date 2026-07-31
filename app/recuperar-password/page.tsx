"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import { supabase } from "@/lib/supabase";

export default function RecuperarPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [enviado, setEnviado] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);
    setError("");

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/restablecer-password`,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    setEnviado(true);
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />

      <div className="flex items-center justify-center min-h-screen pt-24 lg:pt-20 px-6">

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 sm:p-10 w-full max-w-md">

          <h1 className="text-2xl sm:text-3xl font-black text-center mb-3">
            Recuperar Contraseña
          </h1>

          {enviado ? (
            <>
              <p className="text-zinc-400 text-center mt-6 leading-6">
                Si <span className="text-white font-semibold">{email}</span>{" "}
                está registrado, te mandamos un mail con un link para
                restablecer tu contraseña. Revisá también la carpeta de spam.
              </p>

              <Link
                href="/login"
                className="mt-8 block w-full text-center bg-red-600 hover:bg-red-700 rounded-xl py-3 font-bold transition"
              >
                Volver a Iniciar Sesión
              </Link>
            </>
          ) : (
            <form onSubmit={handleSubmit}>
              <p className="text-zinc-400 text-center mb-8 text-sm sm:text-base">
                Ingresá el correo con el que te registraste y te
                mandamos un link para crear una contraseña nueva.
              </p>

              {error && (
                <div className="mb-5 rounded-lg bg-red-600/20 border border-red-600 p-3 text-sm text-red-300">
                  {error}
                </div>
              )}

              <div className="mb-8">
                <label className="block mb-2 text-zinc-400">
                  Correo
                </label>

                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-black border border-zinc-700 rounded-xl p-3 outline-none focus:border-red-600"
                />
              </div>

              <button
                disabled={loading}
                className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-60 rounded-xl py-3 font-bold transition"
              >
                {loading ? "Enviando..." : "Enviar Link"}
              </button>

              <p className="mt-6 text-center text-zinc-400 text-sm sm:text-base">
                <Link
                  href="/login"
                  className="text-red-500 hover:text-red-400"
                >
                  ← Volver a Iniciar Sesión
                </Link>
              </p>
            </form>
          )}

        </div>

      </div>

    </main>
  );
}
