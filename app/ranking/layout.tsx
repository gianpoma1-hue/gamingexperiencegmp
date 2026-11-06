import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ranking mensual",
  description:
    "Próximamente: un ranking mensual donde cada partido suma y los mejores ganan premios en efectivo.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
