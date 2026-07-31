export default function BackgroundEffects() {
  return (
    <div className="fixed inset-0 -z-50 overflow-hidden pointer-events-none">

      {/* Fondo base */}
      <div className="absolute inset-0 bg-[#050505]" />

      {/* Degradado azul -> negro */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, rgba(3,15,40,.95) 0%, rgba(5,5,5,.65) 35%, rgba(5,5,5,1) 70%)",
        }}
      />

      {/* Foco azul brillante (esquina superior izquierda) */}
      <div
        className="absolute -top-[60px] -left-[60px] w-[180px] h-[180px] lg:-top-[120px] lg:-left-[120px] lg:w-[380px] lg:h-[380px] rounded-full blur-[35px] lg:blur-[70px]"
        style={{
          background:
            "radial-gradient(circle, rgba(180,220,255,1) 0%, rgba(80,170,255,.9) 15%, rgba(20,110,255,.55) 40%, transparent 72%)",
        }}
      />

      {/* Halo azul grande */}
      <div
        className="absolute -top-[180px] -left-[180px] w-[560px] h-[560px] lg:-top-[420px] lg:-left-[420px] lg:w-[1500px] lg:h-[1500px] rounded-full blur-[90px] lg:blur-[260px]"
        style={{
          background:
            "radial-gradient(circle, rgba(0,90,255,.40) 0%, rgba(0,70,220,.18) 40%, rgba(0,40,150,.08) 60%, transparent 82%)",
        }}
      />

      {/* Halo azul inferior */}
      <div
        className="absolute bottom-[-100px] left-[-60px] w-[420px] h-[420px] lg:bottom-[-250px] lg:left-[-150px] lg:w-[1100px] lg:h-[1100px] rounded-full blur-[80px] lg:blur-[240px]"
        style={{
          background:
            "radial-gradient(circle, rgba(0,110,255,.20) 0%, transparent 75%)",
        }}
      />

      {/* Glow rojo principal */}
      <div
        className="absolute top-[-100px] right-[-120px] w-[640px] h-[640px] lg:top-[-260px] lg:right-[-320px] lg:w-[1700px] lg:h-[1700px] rounded-full blur-[100px] lg:blur-[280px]"
        style={{
          background:
            "radial-gradient(circle, rgba(255,30,30,.48) 0%, rgba(255,30,30,.22) 38%, rgba(180,0,0,.08) 58%, transparent 82%)",
        }}
      />

      {/* Glow rojo secundario */}
      <div
        className="absolute bottom-[-110px] right-[-70px] w-[480px] h-[480px] lg:bottom-[-300px] lg:right-[-180px] lg:w-[1300px] lg:h-[1300px] rounded-full blur-[85px] lg:blur-[240px]"
        style={{
          background:
            "radial-gradient(circle, rgba(255,20,20,.25) 0%, transparent 75%)",
        }}
      />

      {/* Reflejo rojo cerca del personaje (solo escritorio, en mobile el personaje está en otra posición) */}
      <div
        className="hidden lg:block absolute top-[160px] right-[280px] w-[500px] h-[500px] rounded-full blur-[120px]"
        style={{
          background:
            "radial-gradient(circle, rgba(255,60,60,.30) 0%, transparent 75%)",
        }}
      />

      {/* Viñeta */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at center, transparent 22%, rgba(0,0,0,.20) 58%, rgba(0,0,0,.84) 100%)",
        }}
      />

    </div>
  );
}
