import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contacto",
  description:
    "Escribinos para consultas, soporte o reclamos sobre los torneos de GMP Gaming.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
