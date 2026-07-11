import Image from "next/image";

export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 w-full bg-black/80 backdrop-blur-md border-b border-red-600 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-8 py-4">
        
        {/* Logo */}
        <div className="flex items-center gap-3">
          <Image
            src="/images/logo.png"
            alt="Gaming Experience GMP"
            width={60}
            height={60}
          />

          <div>
            <h1 className="text-xl font-bold text-white">
              Gaming Experience
            </h1>
            <p className="text-sm text-red-600 font-semibold">
              GMP
            </p>
          </div>
        </div>

        {/* Menú */}
        <nav className="hidden md:flex items-center gap-8">
          <a href="#" className="hover:text-red-500 transition">
            Inicio
          </a>

          <a href="#" className="hover:text-red-500 transition">
            Torneos
          </a>

          <a href="#" className="hover:text-red-500 transition">
            Ranking
          </a>

          <a href="#" className="hover:text-red-500 transition">
            Reglamento
          </a>

          <button className="bg-red-600 hover:bg-red-700 px-5 py-2 rounded-lg font-semibold transition">
            Iniciar sesión
          </button>
        </nav>
      </div>
    </header>
  );
}