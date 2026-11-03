import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Restablecer contraseña",
  description:
    "Elegí una nueva contraseña para tu cuenta de GMP Gaming.",
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
