import type { MetadataRoute } from "next";

const BASE = "https://gmpgaming.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const rutas = [
    { ruta: "", prioridad: 1 },
    { ruta: "/torneos", prioridad: 0.9 },
    { ruta: "/torneos/ea-fc-27", prioridad: 0.8 },
    { ruta: "/torneos/cs2", prioridad: 0.8 },
    { ruta: "/ranking", prioridad: 0.7 },
    { ruta: "/reglamento", prioridad: 0.6 },
    { ruta: "/faq", prioridad: 0.5 },
    { ruta: "/register", prioridad: 0.5 },
    { ruta: "/contacto", prioridad: 0.4 },
    { ruta: "/terminos", prioridad: 0.3 },
  ];

  return rutas.map(({ ruta, prioridad }) => ({
    url: `${BASE}${ruta}`,
    lastModified: new Date(),
    priority: prioridad,
  }));
}
