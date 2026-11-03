import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Crear cuenta gratis",
  description:
    "Registrate gratis en GMP Gaming y empezá a competir en torneos online con premios reales.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
