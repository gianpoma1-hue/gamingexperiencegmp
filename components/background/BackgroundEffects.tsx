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
        className="absolute -top-[120px] -left-[120px] w-[380px] h-[380px] rounded-full blur-[70px]"
        style={{
          background:
            "radial-gradient(circle, rgba(180,220,255,1) 0%, rgba(80,170,255,.9) 15%, rgba(20,110,255,.55) 40%, transparent 72%)",
        }}
      />

      {/* Halo azul grande */}
      <div
        className="absolute -top-[420px] -left-[420px] w-[1500px] h-[1500px] rounded-full blur-[260px]"
        style={{
          background:
            "radial-gradient(circle, rgba(0,90,255,.40) 0%, rgba(0,70,220,.18) 40%, rgba(0,40,150,.08) 60%, transparent 82%)",
        }}
      />

      {/* Halo azul inferior */}
      <div
        className="absolute bottom-[-250px] left-[-150px] w-[1100px] h-[1100px] rounded-full blur-[240px]"
        style={{
          background:
            "radial-gradient(circle, rgba(0,110,255,.20) 0%, transparent 75%)",
        }}
      />

      {/* Glow rojo principal */}
      <div
        className="absolute top-[-260px] right-[-320px] w-[1700px] h-[1700px] rounded-full blur-[280px]"
        style={{
          background:
            "radial-gradient(circle, rgba(255,30,30,.48) 0%, rgba(255,30,30,.22) 38%, rgba(180,0,0,.08) 58%, transparent 82%)",
        }}
      />

      {/* Glow rojo secundario */}
      <div
        className="absolute bottom-[-300px] right-[-180px] w-[1300px] h-[1300px] rounded-full blur-[240px]"
        style={{
          background:
            "radial-gradient(circle, rgba(255,20,20,.25) 0%, transparent 75%)",
        }}
      />

      {/* Reflejo rojo cerca del personaje */}
      <div
        className="absolute top-[160px] right-[280px] w-[500px] h-[500px] rounded-full blur-[120px]"
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