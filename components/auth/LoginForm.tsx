"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        throw new Error(authError.message);
      }

      if (data.user) {
        // CAMBIADO: Ahora redirige al inicio en lugar del dashboard
        router.push("/");
        router.refresh();
      }
    } catch (err: any) {
      if (err.message === "Invalid login credentials") {
        setError("El correo o la contraseña son incorrectos.");
      } else {
        setError(err.message || "Ocurrió un error al iniciar sesión.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 bg-black/40 backdrop-blur-md border border-red-900/30 rounded-2xl shadow-xl">
      <h2 className="text-2xl font-bold text-white text-center mb-6">
        Iniciar Sesión
      </h2>

      {error && (
        <div className="mb-4 p-3 bg-red-900/40 border border-red-600 text-red-200 text-sm rounded-lg text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Correo Electrónico
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 text-white rounded-lg focus:outline-none focus:border-red-600 transition"
            placeholder="ejemplo@correo.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Contraseña
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 text-white rounded-lg focus:outline-none focus:border-red-600 transition"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 mt-2 bg-red-600 hover:bg-red-700 disabled:bg-red-800/50 text-white font-bold rounded-lg transition"
        >
          {loading ? "Ingresando..." : "Iniciar sesión"}
        </button>
      </form>

      <p className="mt-6 text-sm text-center text-gray-400">
        ¿No tenés una cuenta?{" "}
        <Link href="/register" className="text-red-500 hover:underline">
          Registrate acá
        </Link>
      </p>
    </div>
  );
}