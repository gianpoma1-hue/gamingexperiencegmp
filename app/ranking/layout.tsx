import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ranking de jugadores",
  description:
    "Mirá quiénes lideran el ranking de GMP Gaming y qué premios hay en juego.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
