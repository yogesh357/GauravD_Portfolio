import type { Metadata } from "next";
import { getCategories, getPhotos, getSiteSettings } from "@/lib/db/queries";
import { Navbar } from "@/components/layout/Navbar";
import { PortfolioGrid } from "@/components/sections/PortfolioGrid";
import { Footer } from "@/components/layout/Footer";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Complete Works Archive — Gaurav Damahe Photography",
  description:
    "Explore the complete catalog of fine art photographs, editorial essays, and street documentation by Gaurav Damahe.",
  openGraph: {
    title: "Complete Works Archive — Gaurav Damahe Photography",
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
      <Navbar
        siteName={settings?.photographerName || "Gaurav Damahe"}
        instagram={settings?.instagram || "https://www.instagram.com/gaurav_unfiltered_"}
        email={settings?.email || "gauravxd153@gmail.com"}
        location={settings?.location || "Pune / Mumbai, Maharashtra"}
      />

      <main className="pt-20 sm:pt-28 pb-16">
        {/* Full Gallery Archive with K72 Scroll & Page Load Animation */}
        <PortfolioGrid
          initialPhotos={allPhotos}
          categories={categories}
          isHomepagePreview={false}
        />
      </main>

      <Footer
        siteName={settings?.photographerName || "Gaurav Damahe"}
        location={settings?.location || "Pune / Mumbai"}
      />
    </div>
  );
}
