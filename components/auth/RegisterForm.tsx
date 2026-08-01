"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function RegisterForm() {
  const router = useRouter();

  const [nombre, setNombre] = useState("");
  const [usuario, setUsuario] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (
      !nombre ||
      !usuario ||
      !email ||
      !password
    ) {
      setError("Completá todos los campos.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    setLoading(true);

    const { data: existente } = await supabase
      .from("usuarios")
      .select("id")
      .ilike("usuario", usuario)
      .maybeSingle();

    if (existente) {
      setLoading(false);
      setError("Ese nombre de usuario ya existe. Elegí otro.");
      return;
    }

    const { data, error: authError } =
      await supabase.auth.signUp({
        email,
        password,
      });

    if (authError) {
      setLoading(false);
      setError(authError.message);
      return;
    }

    if (data.user) {
      const { error: profileError } = await supabase
        .from("usuarios")
        .insert({
          id: data.user.id,
          nombre,
          usuario,
          email,
        });

      if (profileError) {
        setLoading(false);

        if (profileError.code === "23505") {
          if (profileError.message.includes("usuario")) {
            setError(
              "Ese nombre de usuario ya existe. Elegí otro."
            );
          } else {
            setError("Ya existe una cuenta con esos datos.");
          }
        } else {
          setError(profileError.message);
        }

        return;
      }
    }

    setLoading(false);

    setSuccess("¡Cuenta creada correctamente!");

    setTimeout(() => {
      router.push("/login");
    }, 1500);
  }

  return (
    <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 p-8 shadow-2xl">

      <h1 className="text-3xl font-black text-center text-white mb-8">
        Crear Cuenta
      </h1>

      {error && (
        <div className="mb-5 rounded-lg border border-red-600 bg-red-600/20 p-3 text-red-300 text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-5 rounded-lg border border-green-600 bg-green-600/20 p-3 text-green-300 text-sm">
          {success}
        </div>
      )}

      <form onSubmit={handleRegister} className="space-y-5">

        <input
          type="text"
          placeholder="Nombre completo"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="w-full rounded-xl bg-black border border-zinc-700 p-3"
        />

        <input
          type="text"
          placeholder="Usuario del juego"
          value={usuario}
          onChange={(e) => setUsuario(e.target.value)}
          className="w-full rounded-xl bg-black border border-zinc-700 p-3"
        />

        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-xl bg-black border border-zinc-700 p-3"
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-xl bg-black border border-zinc-700 p-3"
        />

        <input
          type="password"
          placeholder="Confirmar contraseña"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full rounded-xl bg-black border border-zinc-700 p-3"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-red-600 py-3 font-bold hover:bg-red-700"
        >
          {loading ? "Creando cuenta..." : "Registrarse"}
        </button>

      </form>

      <p className="mt-6 text-center text-zinc-400">
        ¿Ya tenés una cuenta?{" "}
        <Link
          href="/login"
          className="text-red-500 hover:text-red-400"
        >
          Iniciar sesión
        </Link>
      </p>

    </div>
  );
}