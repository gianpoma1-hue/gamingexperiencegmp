import Image from "next/image";

export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-black/70 backdrop-blur-xl border-b border-red-900/40">
      <div className="max-w-7xl mx-auto h-20 flex items-center justify-between px-8">

        {/* Logo */}
        <div className="flex items-center gap-3">

          <Image
            src="/images/logo.png"
            alt="Gaming Experience GMP"
            width={50}
            height={50}
          />

          <div>
            <h1 className="text-white font-bold text-xl leading-5">
              Gaming Experience
            </h1>

            <span className="text-red-600 font-semibold text-sm">
              GMP
            </span>
          </div>

        </div>

        {/* Menú */}

        <nav className="hidden lg:flex items-center gap-10 text-white font-medium">

          <a href="#" className="hover:text-red-600 transition">
            Inicio
          </a>

          <a href="#" className="hover:text-red-600 transition">
            Torneos
          </a>

          <a href="#" className="hover:text-red-600 transition">
            Ranking
          </a>

          <a href="#" className="hover:text-red-600 transition">
            Reglamento
          </a>

        </nav>

        <button className="bg-red-600 hover:bg-red-700 transition px-6 py-3 rounded-xl font-bold text-white">
          Iniciar sesión
        </button>

      </div>
    </header>
  );
}