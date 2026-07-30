"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import NotificationBell from "./NotificationBell";
import MessagesBell from "./MessagesBell";
import { FaUserShield, FaChartLine } from "react-icons/fa";

export default function Navbar() {
  const router = useRouter();
  const { user, isAdmin, logout } = useAuth();

  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    setMenuOpen(false);
    router.push("/");
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">

        {/* LOGO */}
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-3"
        >
          <img
            src="/images/logo.png"
            alt="Gaming Experience GMP"
            className="h-10"
          />

          <div className="text-left">
            <h1 className="font-bold text-lg">
              Gaming Experience
            </h1>

            <p className="text-red-600 text-sm font-bold">
              GMP
            </p>
          </div>
        </button>

        {/* MENÚ */}
        <div className="flex items-center gap-8 text-sm font-medium text-zinc-300">

          <button
            onClick={() => router.push("/")}
            className="hover:text-red-500 transition"
          >
            Inicio
          </button>

          <button
            onClick={() => router.push("/torneos")}
            className="hover:text-red-500 transition"
          >
            Torneos
          </button>

          <button
            onClick={() => router.push("/ranking")}
            className="hover:text-red-500 transition"
          >
            Ranking
          </button>

          <button
            onClick={() => router.push("/reglamento")}
            className="hover:text-red-500 transition"
          >
            Reglamento
          </button>

        </div>

        {/* DERECHA */}
        {!user ? (

          <button
            onClick={() => router.push("/login")}
            className="bg-red-600 hover:bg-red-700 transition px-6 py-3 rounded-xl font-bold"
          >
            Iniciar Sesión
          </button>

        ) : (

          <div className="flex items-center gap-4">

            {isAdmin && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => router.push("/admin")}
                  title="Panel de Administración"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-red-600 text-sm font-semibold transition"
                >
                  <FaUserShield className="text-red-500" />
                  <span className="hidden lg:inline">Admin</span>
                </button>

                <button
                  onClick={() => router.push("/dashboard/resultados")}
                  title="Dashboard de Resultados"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-red-600 text-sm font-semibold transition"
                >
                  <FaChartLine className="text-red-500" />
                  <span className="hidden lg:inline">Dashboard</span>
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
              <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center font-bold">
                {user.email?.charAt(0).toUpperCase()}
              </div>

              <span className="font-medium">
                {user.email?.split("@")[0]}
              </span>
            </button>

            {menuOpen && (

              <div className="absolute right-0 mt-3 w-60 bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-2xl">

                <button
                  onClick={() => {
                    router.push("/perfil");
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

      </div>
    </nav>
  );
}

