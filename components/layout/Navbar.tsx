"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import NotificationBell from "./NotificationBell";
import MessagesBell from "./MessagesBell";
import { FaUserShield, FaChartLine } from "react-icons/fa";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const router = useRouter();
  const { user, isAdmin, logout } = useAuth();

  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [miUsuario, setMiUsuario] = useState<string | null>(null);
  const [fotoPerfil, setFotoPerfil] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setMiUsuario(null);
      setFotoPerfil(null);
      return;
    }

    supabase
      .from("usuarios")
      .select("usuario, foto_perfil")
      .eq("id", user.id)
      .single()
      .then(({ data }) => {
        setMiUsuario(data?.usuario ?? null);
        setFotoPerfil(data?.foto_perfil ?? null);
      });
  }, [user]);

  const nombreMostrado = miUsuario ?? user?.email?.split("@")[0] ?? "";

  const handleLogout = async () => {
    await logout();
    setMenuOpen(false);
    setMobileOpen(false);
    router.push("/");
  };

  const ir = (ruta: string) => {
    router.push(ruta);
    setMobileOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 lg:h-20 flex items-center justify-between">

        {/* LOGO */}
        <button
          onClick={() => ir("/")}
          className="flex items-center gap-2 sm:gap-3"
        >
          <img
            src="/images/logo.png"
            alt="Gaming Experience GMP"
            className="h-8 lg:h-10"
          />

          <div className="text-left">
            <h1 className="font-bold text-sm sm:text-lg leading-tight">
              Gaming Experience
            </h1>

            <p className="text-red-600 text-xs sm:text-sm font-bold leading-tight">
              GMP
            </p>
          </div>
        </button>

        {/* MENÚ DESKTOP */}
        <div className="hidden lg:flex items-center gap-8 text-sm font-medium text-zinc-300">

          <button onClick={() => ir("/")} className="hover:text-red-500 transition">
            Inicio
          </button>

          <button onClick={() => ir("/torneos")} className="hover:text-red-500 transition">
            Torneos
          </button>

          <button onClick={() => ir("/ranking")} className="hover:text-red-500 transition">
            Ranking
          </button>

          <button onClick={() => ir("/reglamento")} className="hover:text-red-500 transition">
            Reglamento
          </button>

        </div>

        {/* DERECHA DESKTOP */}
        {!user ? (

          <button
            onClick={() => ir("/login")}
            className="hidden lg:block bg-red-600 hover:bg-red-700 transition px-6 py-3 rounded-xl font-bold"
          >
            Iniciar Sesión
          </button>

        ) : (

          <div className="hidden lg:flex items-center gap-4">

            {isAdmin && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => ir("/admin")}
                  title="Panel de Administración"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-red-600 text-sm font-semibold transition"
                >
                  <FaUserShield className="text-red-500" />
                  <span className="hidden xl:inline">Admin</span>
                </button>

                <button
                  onClick={() => ir("/dashboard/resultados")}
                  title="Dashboard de Resultados"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-red-600 text-sm font-semibold transition"
                >
                  <FaChartLine className="text-red-500" />
                  <span className="hidden xl:inline">Dashboard</span>
                </button>
              </div>
            )}

            <MessagesBell />

            <NotificationBell />

            <div className="relative">

              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center font-bold overflow-hidden shrink-0">
                  {fotoPerfil ? (
                    <img
                      src={fotoPerfil}
                      alt={nombreMostrado}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    nombreMostrado.charAt(0).toUpperCase()
                  )}
                </div>

                <span className="font-medium">
                  {nombreMostrado}
                </span>
              </button>

              {menuOpen && (

                <div className="absolute right-0 mt-3 w-60 bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-2xl">

                  <button
                    onClick={() => {
                      ir("/perfil");
                      setMenuOpen(false);
                    }}
                    className="block w-full text-left px-5 py-3 hover:bg-zinc-800 transition"
                  >
                    👤 Mi Perfil
                  </button>

                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-5 py-3 text-red-500 hover:bg-red-600 hover:text-white transition"
                  >
                    🚪 Cerrar Sesión
                  </button>

                </div>

              )}

            </div>

          </div>

        )}

        {/* DERECHA MOBILE: campanitas + hamburguesa */}
        <div className="flex lg:hidden items-center gap-2">
          {user && (
            <>
              <MessagesBell />
              <NotificationBell />
            </>
          )}

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 rounded-lg bg-zinc-900 border border-zinc-800"
            aria-label="Abrir menú"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

      </div>

      {/* PANEL MOBILE */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-zinc-800 bg-black/95 backdrop-blur-md px-4 sm:px-6 py-4 space-y-1">

          <button
            onClick={() => ir("/")}
            className="block w-full text-left px-3 py-3 rounded-lg hover:bg-zinc-900 font-medium"
          >
            Inicio
          </button>

          <button
            onClick={() => ir("/torneos")}
            className="block w-full text-left px-3 py-3 rounded-lg hover:bg-zinc-900 font-medium"
          >
            Torneos
          </button>

          <button
            onClick={() => ir("/ranking")}
            className="block w-full text-left px-3 py-3 rounded-lg hover:bg-zinc-900 font-medium"
          >
            Ranking
          </button>

          <button
            onClick={() => ir("/reglamento")}
            className="block w-full text-left px-3 py-3 rounded-lg hover:bg-zinc-900 font-medium"
          >
            Reglamento
          </button>

          {!user ? (
            <button
              onClick={() => ir("/login")}
              className="mt-3 w-full bg-red-600 hover:bg-red-700 transition px-6 py-3 rounded-xl font-bold"
            >
              Iniciar Sesión
            </button>
          ) : (
            <>
              <div className="h-px bg-zinc-800 my-2" />

              {isAdmin && (
                <>
                  <button
                    onClick={() => ir("/admin")}
                    className="flex items-center gap-2 w-full text-left px-3 py-3 rounded-lg hover:bg-zinc-900 font-medium"
                  >
                    <FaUserShield className="text-red-500" />
                    Panel de Administración
                  </button>

                  <button
                    onClick={() => ir("/dashboard/resultados")}
                    className="flex items-center gap-2 w-full text-left px-3 py-3 rounded-lg hover:bg-zinc-900 font-medium"
                  >
                    <FaChartLine className="text-red-500" />
                    Dashboard de Resultados
                  </button>

                  <div className="h-px bg-zinc-800 my-2" />
                </>
              )}

              <button
                onClick={() => ir("/perfil")}
                className="block w-full text-left px-3 py-3 rounded-lg hover:bg-zinc-900 font-medium"
              >
                👤 Mi Perfil ({nombreMostrado})
              </button>

              <button
                onClick={handleLogout}
                className="block w-full text-left px-3 py-3 rounded-lg text-red-500 hover:bg-red-600 hover:text-white font-medium transition"
              >
                🚪 Cerrar Sesión
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
