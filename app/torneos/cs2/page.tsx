import Navbar from "@/components/layout/Navbar";
import Link from "next/link";

export default function CS2TorneosPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-12">
        <Link 
          href="/torneos" 
          className="inline-block mb-6 text-sm text-gray-400 hover:text-white bg-neutral-900 px-4 py-2 rounded-lg transition"
        >
          ← Volver a Juegos
        </Link>
        
        <h1 className="text-4xl md:text-5xl font-bold mb-2">
          Counter-Strike <span className="text-red-600">2</span>
        </h1>
        <p className="text-gray-400 mb-8">Elegi un torneo y comenza a competir.</p>

        <p className="text-gray-500 italic">No hay torneos disponibles.</p>
      </div>
    </div>
  );
}
