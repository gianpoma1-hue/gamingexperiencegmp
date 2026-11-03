import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mi perfil",
  description:
    "Tu perfil de jugador en GMP Gaming.",
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
