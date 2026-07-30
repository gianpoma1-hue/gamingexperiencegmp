"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [checking, setChecking] = useState(true);
  const [esAdmin, setEsAdmin] = useState(false);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.push("/login");
      return;
    }

    verificarAdmin();
  }, [authLoading, user]);

  async function verificarAdmin() {
    const { data, error } = await supabase
      .from("usuarios")
      .select("es_admin")
      .eq("id", user!.id)
      .single();

    if (error || !data?.es_admin) {
      alert("No tenés permisos para acceder a esta sección.");
      router.push("/");
      return;
    }

    setEsAdmin(true);
    setChecking(false);
  }

  if (authLoading || checking) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-xl text-zinc-400">Verificando acceso...</p>
      </main>
    );
  }

  if (!esAdmin) {
    return null;
  }

  return <>{children}</>;
}
