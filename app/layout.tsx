import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://gmpgaming.com"),
  title: {
    default: "GMP Gaming | Torneos online de videojuegos en Argentina",
    template: "%s | GMP Gaming",
  },
  description:
    "Competí en torneos online de videojuegos, escalá posiciones y conseguí premios reales.",
  applicationName: "GMP Gaming",
  openGraph: {
    type: "website",
    locale: "es_AR",
    url: "https://gmpgaming.com",
    siteName: "GMP Gaming",
    title: "GMP Gaming | Subí de nivel. Ganá premios.",
    description:
      "Torneos online de videojuegos con premios reales. Registrate gratis, elegí tu torneo y competí.",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "GMP Gaming - Subí de nivel. Ganá premios.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "GMP Gaming | Subí de nivel. Ganá premios.",
    description:
      "Torneos online de videojuegos con premios reales. Registrate gratis y competí.",
    images: ["/og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es-AR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
<body className="min-h-full flex flex-col" suppressHydrationWarning>
        {/* Google tag (gtag.js): Analytics + Google Ads */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-P5MQXZ2GTR"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-P5MQXZ2GTR');
            gtag('config', 'AW-18445425505');
          `}
        </Script>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}

