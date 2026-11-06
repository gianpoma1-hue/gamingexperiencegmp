import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de privacidad",
  description:
    "Qué datos personales recopila GMP Gaming, para qué los usa y cómo podés ejercer tus derechos.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
