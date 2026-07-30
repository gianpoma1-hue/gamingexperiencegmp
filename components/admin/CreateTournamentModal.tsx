"use client";

import { FaPlus } from "react-icons/fa";
import { useRouter } from "next/navigation";

export default function CreateTournamentModal() {
  const router = useRouter();

  return (
    <div className="mb-10 flex justify-end">

      <button
        onClick={() => router.push("/admin/torneos/nuevo")}
        className="bg-red-600 hover:bg-red-700 transition px-8 py-4 rounded-2xl font-bold flex items-center gap-3"
      >
        <FaPlus />
        Crear Torneo
      </button>

    </div>
  );
}