import type { Metadata } from "next";
import { getCategories, getPhotos, getSiteSettings } from "@/lib/db/queries";
import { Navbar } from "@/components/layout/Navbar";
import { PortfolioGrid } from "@/components/sections/PortfolioGrid";
import { Footer } from "@/components/layout/Footer";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Complete Works Archive — Gaurav  Photography",
  description:
    "Explore the complete catalog of fine art photographs, editorial essays, and architectural studies by Gaurav ",
  openGraph: {
    title: "Complete Works Archive — Gaurav  Photography",
    description: "Fine art photography portfolio across portraits, architecture, landscapes, and street.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1600&auto=format&fit=crop",
        width: 1600,
        height: 1066,
      },
    ],
  },
};

export default async function WorkArchivePage() {
  const [categories, allPhotos, settings] = await Promise.all([
    getCategories(),
    getPhotos({ publishedOnly: true }),
    getSiteSettings(),
  ]);

  return (
    <div className="min-h-screen bg-canvas text-ink flex flex-col justify-between">
      <Navbar siteName={settings?.photographerName || "GAURAV "} />

      <main className="pt-20 sm:pt-28 pb-16">
        {/* Full Gallery Archive with K72 Scroll & Page Load Animation */}
        <PortfolioGrid
          initialPhotos={allPhotos}
          categories={categories}
          isHomepagePreview={false}
        />
      </main>

      <Footer />
    </div>
  );
}
