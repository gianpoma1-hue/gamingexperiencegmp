import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reglamento oficial",
  description:
    "Reglas oficiales de los torneos de GMP Gaming: formato, horarios, conducta y reporte de resultados.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
