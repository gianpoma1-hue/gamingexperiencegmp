export default function CyberBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <svg
        className="absolute inset-0 h-full w-full opacity-[0.15]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="gmp-circuit"
            width="140"
            height="140"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M0 70 H50 V20 H100"
              stroke="#22d3ee"
              strokeWidth="1"
              fill="none"
            />
            <path
              d="M140 90 H90 V130 H40"
              stroke="#22d3ee"
              strokeWidth="1"
              fill="none"
            />
            <circle cx="50" cy="20" r="3" fill="#22d3ee" />
            <circle cx="90" cy="130" r="3" fill="#22d3ee" />
            <circle cx="100" cy="20" r="2" fill="#22d3ee" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#gmp-circuit)" />
      </svg>

      <div
        className="absolute inset-x-0 bottom-0 h-[380px]"
        style={{ perspective: "500px" }}
      >
        <div
          className="absolute inset-0 opacity-40"
          style={{
            transform: "rotateX(78deg)",
            transformOrigin: "bottom",
            backgroundImage:
              "linear-gradient(rgba(34,211,238,.55) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,.55) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
            maskImage: "linear-gradient(to top, black 10%, transparent 85%)",
            WebkitMaskImage:
              "linear-gradient(to top, black 10%, transparent 85%)",
          }}
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/70" />
    </div>
  );
}
