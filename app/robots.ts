import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin",
        "/dashboard",
        "/perfil",
        "/mensajes",
        "/login",
        "/recuperar-password",
        "/restablecer-password",
      ],
    },
    sitemap: "https://gmpgaming.com/sitemap.xml",
  };
}
