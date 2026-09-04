import { getCategories, getPhotos, getSiteSettings } from "@/lib/db/queries";
import { Navbar } from "@/components/layout/Navbar";
import { Hero } from "@/components/sections/Hero";
import { AboutPhotographer } from "@/components/sections/AboutPhotographer";
import { PortfolioGrid } from "@/components/sections/PortfolioGrid";
import { SelectedStory } from "@/components/sections/SelectedStory";
import { ContactSection } from "@/components/sections/ContactSection";
import { Footer } from "@/components/layout/Footer";

export const revalidate = 60;

export default async function HomePage() {
  const [categories, allPhotos, settings] = await Promise.all([
    getCategories(),
    getPhotos({ publishedOnly: true }),
    getSiteSettings(),
  ]);

  const featuredPhotos = allPhotos.filter((p) => p.featured);
  const heroPhoto = featuredPhotos[0] || allPhotos[0];

  return (
    <main className="relative min-h-screen bg-canvas text-ink overflow-x-hidden selection:bg-ink selection:text-canvas">
      {/* Editorial Floating Navbar */}
      <Navbar siteName={settings?.photographerName || "GAURAV D."} />

      {/* 1. Hero Section (Split Typography & Multi-Image Art-Directed Composition) */}
      <Hero
        featuredPhoto={heroPhoto}
        photographerName={settings?.photographerName}
        tagline={settings?.tagline}
      />

      {/* 2. Unified About & Philosophy (Biography, Discipline, Clients & Exhibitions) */}
      <AboutPhotographer settings={settings} />

      {/* 3. Selected Works Gallery (Curated Preview with Category Filters + Link to /work) */}
      <PortfolioGrid
        initialPhotos={allPhotos}
        categories={categories}
        isHomepagePreview={true}
      />

      {/* 4. Featured Visual Story / Narrative Essay Spread ("Shadows of Kyoto") */}
      <SelectedStory />

      {/* 5. Contact CTA & Commission Dialogue Form */}
      <ContactSection settings={settings} />

      {/* 6. Minimalist Editorial Footer with Studio Clocks */}
      <Footer />
    </main>
  );
}
