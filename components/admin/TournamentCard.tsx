"use client";

import {
  FaCalendarAlt,
  FaUsers,
  FaGamepad,
  FaTrophy,
  FaEdit,
  FaTrash,
  FaLock,
} from "react-icons/fa";

interface TournamentCardProps {
  nombre: string;
  juego: string;
  fecha: string;
  jugadores: string;
  premio: string;
  estado: "Abierto" | "Cerrado";
}

export default function TournamentCard({
  nombre,
  juego,
  fecha,
  jugadores,
  premio,
  estado,
}: TournamentCardProps) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 hover:border-red-600 transition">

      <div className="flex justify-between items-start">

        <div>

          <h2 className="text-3xl font-black">
            {nombre}
          </h2>

          <p className="text-zinc-400 mt-2 flex items-center gap-2">
            <FaGamepad />
            {juego}
          </p>

        </div>

        <span
          className={`px-4 py-2 rounded-full text-sm font-bold ${
            estado === "Abierto"
              ? "bg-green-600"
              : "bg-red-600"
          }`}
        >
          {estado}
        </span>

      </div>

      <div className="grid md:grid-cols-3 gap-6 mt-8">

        <div>

          <p className="text-zinc-500 flex items-center gap-2">
            <FaCalendarAlt />
            Fecha
          </p>

          <h3 className="font-bold mt-2">
            {fecha}
          </h3>

        </div>

        <div>

          <p className="text-zinc-500 flex items-center gap-2">
            <FaUsers />
            Jugadores
          </p>

          <h3 className="font-bold mt-2">
            {jugadores}
          </h3>

        </div>

        <div>

          <p className="text-zinc-500 flex items-center gap-2">
            <FaTrophy />
            Premio
          </p>

          <h3 className="font-bold mt-2 text-green-500">
            {premio}
          </h3>

        </div>

      </div>

      <div className="grid grid-cols-3 gap-4 mt-10">

        <button className="bg-blue-600 hover:bg-blue-700 rounded-xl py-3 font-bold flex items-center justify-center gap-2 transition">
          <FaEdit />
          Editar
        </button>

        <button className="bg-yellow-600 hover:bg-yellow-700 rounded-xl py-3 font-bold flex items-center justify-center gap-2 transition">
          <FaLock />
          Cerrar
        </button>

        <button className="bg-red-600 hover:bg-red-700 rounded-xl py-3 font-bold flex items-center justify-center gap-2 transition">
          <FaTrash />
          Eliminar
        </button>

      </div>

    </div>
  );
}