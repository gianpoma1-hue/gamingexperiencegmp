"use client";

import { useRouter } from "next/navigation";
import {
  FaPlus,
  FaUsers,
  FaChartLine,
  FaClipboardList,
  FaMoneyBillWave,
  FaCog,
} from "react-icons/fa";

export default function QuickActions() {
  const router = useRouter();

  const actions = [
    {
      title: "Crear Torneo",
      icon: <FaPlus />,
      href: "/admin/torneos",
      color: "bg-red-600 hover:bg-red-700",
    },
    {
      title: "Usuarios",
      icon: <FaUsers />,
      href: "/admin/usuarios",
      color: "bg-zinc-800 hover:bg-zinc-700",
    },
    {
      title: "Editar Ranking",
      icon: <FaChartLine />,
      href: "/admin/ranking",
      color: "bg-zinc-800 hover:bg-zinc-700",
    },
    {
      title: "Inscripciones",
      icon: <FaClipboardList />,
      href: "/admin/inscripciones",
      color: "bg-zinc-800 hover:bg-zinc-700",
    },
    {
      title: "Pagos",
      icon: <FaMoneyBillWave />,
      href: "/admin/pagos",
      color: "bg-zinc-800 hover:bg-zinc-700",
    },
    {
      title: "Configuración",
      icon: <FaCog />,
      href: "/admin/configuracion",
      color: "bg-zinc-800 hover:bg-zinc-700",
    },
  ];

  return (
    <div className="mt-12">

      <h2 className="text-3xl font-black mb-8">
        Acciones rápidas
      </h2>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

        {actions.map((action) => (

          <button
            key={action.title}
            onClick={() => router.push(action.href)}
            className={`${action.color} rounded-3xl p-8 text-left transition`}
          >

            <div className="text-4xl mb-6">

              {action.icon}

            </div>

            <h3 className="text-2xl font-bold">

              {action.title}

            </h3>

          </button>

        ))}

      </div>

    </div>
  );
}