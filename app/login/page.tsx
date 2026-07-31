"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/");
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />

      <div className="flex items-center justify-center min-h-screen pt-20 px-6">

        <form
          onSubmit={handleLogin}
          className="bg-zinc-900 border border-zinc-800 rounded-2xl p-10 w-full max-w-md"
        >

          <h1 className="text-3xl font-black text-center mb-8">
            Iniciar Sesión
          </h1>

          {error && (
            <div className="mb-5 rounded-lg bg-red-600/20 border border-red-600 p-3 text-sm text-red-300">
              {error}
            </div>
          )}

          <div className="mb-5">

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

          <div className="mb-8">

            <label className="block mb-2 text-zinc-400">
              Contraseña
            </label>

            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black border border-zinc-700 rounded-xl p-3 outline-none focus:border-red-600"
            />

            <div className="text-right mt-2">
              <Link
                href="/recuperar-password"
                className="text-sm text-zinc-400 hover:text-red-500"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

          </div>

          <button
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 rounded-xl py-3 font-bold transition"
          >
            {loading ? "Ingresando..." : "Iniciar Sesión"}
          </button>

          <p className="mt-6 text-center text-zinc-400">

            ¿No tenés cuenta?{" "}

            <Link
              href="/register"
              className="text-red-500 hover:text-red-400"
            >
              Registrate
            </Link>

          </p>

        </form>

      </div>

    </main>
  );
}