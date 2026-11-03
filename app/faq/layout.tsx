import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Preguntas frecuentes",
  description:
    "Respuestas a las dudas más comunes sobre inscripciones, pagos, partidos y premios en GMP Gaming.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
