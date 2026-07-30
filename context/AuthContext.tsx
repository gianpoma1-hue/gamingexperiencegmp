"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const AuthContext = createContext<any>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) {
      setIsAdmin(false);
      return;
    }

    let cancelado = false;

    supabase
      .from("usuarios")
      .select("es_admin")
      .eq("id", user.id)
      .single()
      .then(({ data }) => {
        if (!cancelado) setIsAdmin(!!data?.es_admin);
      });

    return () => {
      cancelado = true;
    };
  }, [user]);

  const logout = async () => {
    // Ponemos en null ANTES de llamar a la API para respuesta instantánea
    setUser(null);
    setIsAdmin(false);
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
