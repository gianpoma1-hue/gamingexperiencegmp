"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import {
  FaHome,
  FaTrophy,
  FaUsers,
  FaClipboardList,
  FaChartLine,
  FaCog,
  FaMoneyBillWave,
  FaCamera,
  FaHeadset,
  FaUserFriends,
} from "react-icons/fa";

export default function AdminSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const links = [
    {
      icon: <FaHome />,
      title: "Dashboard",
      href: "/admin",
    },
    {
      icon: <FaTrophy />,
      title: "Torneos",
      href: "/admin/torneos",
    },
    {
      icon: <FaUsers />,
      title: "Usuarios",
      href: "/admin/usuarios",
    },
    {
      icon: <FaChartLine />,
      title: "Ranking",
      href: "/admin/ranking",
    },
    {
      icon: <FaClipboardList />,
      title: "Inscripciones",
      href: "/admin/inscripciones",
    },
    {
      icon: <FaUserFriends />,
      title: "Usuarios del Torneo",
      href: "/admin/torneos/usuarios",
    },
    {
      icon: <FaCamera />,
      title: "Reportes",
      href: "/admin/reportes",
    },
    {
      icon: <FaHeadset />,
      title: "Soporte",
      href: "/admin/soporte",
    },
    {
      icon: <FaMoneyBillWave />,
      title: "Finanzas",
      href: "/admin/finanzas",
    },
    {
      icon: <FaCog />,
      title: "Configuración",
      href: "/admin/configuracion",
    },
  ];

  const ir = (href: string) => {
    router.push(href);
    setOpen(false);
  };

  return (
    <>
      {/* Botón flotante para abrir el menú en celular */}
      <button
        onClick={() => setOpen(true)}
        className="lg:hidden fixed top-24 left-4 z-40 bg-zinc-900 border border-zinc-800 p-3 rounded-xl shadow-lg"
        aria-label="Abrir menú de administración"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Panel deslizable en celular */}
      {open && (
        <div
          className="lg:hidden fixed inset-0 z-50 bg-black/70"
          onClick={() => setOpen(false)}
        >
          <aside
            onClick={(e) => e.stopPropagation()}
            className="w-72 max-w-[80vw] h-full bg-zinc-950 border-r border-zinc-800 p-6 overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-10">
              <h1 className="text-xl font-black leading-tight">
                Gaming Experience
                <span className="block text-red-600 text-base">
                  ADMIN
                </span>
              </h1>

              <button
                onClick={() => setOpen(false)}
                className="p-2 rounded-lg bg-zinc-900 border border-zinc-800"
                aria-label="Cerrar menú"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              {links.map((item) => (
                <button
                  key={item.href}
                  onClick={() => ir(item.href)}
                  className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl transition ${
                    pathname === item.href
                      ? "bg-red-600 font-bold"
                      : "bg-zinc-900 hover:bg-zinc-800"
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  {item.title}
                </button>
              ))}
            </div>
          </aside>
        </div>
      )}

      {/* Sidebar fija en escritorio */}
      <aside className="hidden lg:block w-72 min-h-screen bg-zinc-950 border-r border-zinc-800 p-8">
        <h1 className="text-3xl font-black mb-12">
          Gaming Experience
          <span className="block text-red-600">ADMIN</span>
        </h1>

        <div className="space-y-3">
          {links.map((item) => (
            <button
              key={item.href}
              onClick={() => router.push(item.href)}
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl transition ${
                pathname === item.href
                  ? "bg-red-600 font-bold"
                  : "bg-zinc-900 hover:bg-zinc-800"
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              {item.title}
            </button>
          ))}
        </div>
      </aside>
    </>
  );
}
