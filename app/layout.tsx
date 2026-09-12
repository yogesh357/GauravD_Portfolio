import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import { GsapProvider } from "@/components/animations/GsapProvider";
import { PageTransitionProvider } from "@/components/animations/PageTransition";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Gaurav Damahe — Photographer & Visual Artist",
  description:
    "Fine art photography, cultural documentary, and visual storytelling by Gaurav Damahe. Exploring light, fleeting human moments, and quiet solitude across Maharashtra and beyond.",
  keywords: [
    "Gaurav Damahe",
    "Photographer",
    "Fine Art Photography",
    "Street Photography",
    "Editorial Photography",
    "Portrait Photography",
    "Maharashtra Photographer",
    "Pune Photographer",
    "Mumbai Photographer",
  ],
  authors: [{ name: "Gaurav Damahe" }],
  openGraph: {
    title: "Gaurav Damahe — Photographer & Visual Artist",
    description: "Fine art photography and visual storytelling framed in light.",
    url: "https://gaurav.yogeshworks.in",
    siteName: "Gaurav Damahe Photography",
    images: [
      {
        url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1600&auto=format&fit=crop",
        width: 1600,
        height: 1066,
        alt: "Gaurav Damahe Photography Hero Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Gaurav Damahe — Photographer & Visual Artist",
    description: "Fine art photography and visual storytelling framed in light.",
    images: ["https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1600&auto=format&fit=crop"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${inter.variable}`}>
      <body className="font-sans antialiased bg-canvas text-ink selection:bg-ink selection:text-canvas">
        <GsapProvider>
          <PageTransitionProvider>{children}</PageTransitionProvider>
        </GsapProvider>
      </body>
    </html>
  );
}
