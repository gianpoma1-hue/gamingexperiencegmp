"use client";

import { useRouter, usePathname } from "next/navigation";
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
} from "react-icons/fa";

export default function AdminSidebar() {
  const router = useRouter();
  const pathname = usePathname();

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

  return (
    <aside className="w-72 min-h-screen bg-zinc-950 border-r border-zinc-800 p-8">

      <h1 className="text-3xl font-black mb-12">

        Gaming Experience

        <span className="block text-red-600">
          ADMIN
        </span>

      </h1>

      <div className="space-y-3">

        {links.map((item) => (

          <button
            key={item.href}
            onClick={() => router.push(item.href)}
            className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl transition

            ${
              pathname === item.href
                ? "bg-red-600 font-bold"
                : "bg-zinc-900 hover:bg-zinc-800"
            }`}
          >

            <span className="text-xl">

              {item.icon}

            </span>

            {item.title}

          </button>

        ))}

      </div>

    </aside>
  );
}

