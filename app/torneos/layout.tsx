import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Torneos de videojuegos",
  description:
    "Elegí tu juego, inscribite y competí en torneos online de FC 27, Counter-Strike 2 y más, con premios reales.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
