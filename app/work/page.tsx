import type { Metadata } from "next";
import { getCategories, getPhotos, getSiteSettings } from "@/lib/db/queries";
import { Navbar } from "@/components/layout/Navbar";
import { PortfolioGrid } from "@/components/sections/PortfolioGrid";
import { Footer } from "@/components/layout/Footer";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Complete Works Archive — Gaurav D. Photography",
  description:
    "Explore the complete catalog of fine art photographs, editorial essays, and architectural studies by Gaurav D.",
  openGraph: {
    title: "Complete Works Archive — Gaurav D. Photography",
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
      <Navbar siteName={settings?.photographerName || "GAURAV D."} />

      <main className="pt-28 sm:pt-36 pb-20">
        {/* Page Header */}
        <div className="px-6 sm:px-12 max-w-7xl mx-auto mb-8">
          <div className="flex items-center space-x-3 text-xs tracking-ultra uppercase text-ink-muted mb-3">
            <span className="text-bronze">CATALOG</span>
            <span>/</span>
            <span>INDEX OF WORKS</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-6xl font-light text-ink leading-tight">
            Complete Photographic Archive
          </h1>
          <p className="text-ink-muted text-sm sm:text-base font-light max-w-2xl mt-4 leading-relaxed">
            A comprehensive catalog of published monographs, medium-format fine-art studies, and
            commissioned editorial works spanning from 2022 to present.
          </p>
        </div>

        {/* Full Gallery Archive */}
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
