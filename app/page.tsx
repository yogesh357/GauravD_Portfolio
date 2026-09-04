import { getCategories, getPhotos, getSiteSettings } from "@/lib/db/queries";
import { Navbar } from "@/components/layout/Navbar";
import { Hero } from "@/components/sections/Hero";
import { ArtistStatement } from "@/components/sections/ArtistStatement";
import { FeaturedWork } from "@/components/sections/FeaturedWork";
import { PortfolioGrid } from "@/components/sections/PortfolioGrid";
import { SelectedStory } from "@/components/sections/SelectedStory";
import { AboutPhotographer } from "@/components/sections/AboutPhotographer";
import { ContactSection } from "@/components/sections/ContactSection";
import { Footer } from "@/components/layout/Footer";

export const revalidate = 60; // ISR revalidation every 60 seconds

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

      {/* 1. Hero Section */}
      <Hero
        featuredPhoto={heroPhoto}
        photographerName={settings?.photographerName}
        tagline={settings?.tagline}
      />

      {/* 2. Intro / Artist Statement */}
      <ArtistStatement />

      {/* 3. Featured Work Asymmetric Showcase */}
      <FeaturedWork photos={featuredPhotos.length >= 3 ? featuredPhotos : allPhotos} />

      {/* 4. Complete Database-Driven Archive with Category Filter */}
      <PortfolioGrid initialPhotos={allPhotos} categories={categories} />

      {/* 5. Selected Story / Immersive Essay Spread */}
      <SelectedStory />

      {/* 6. About the Photographer & Credentials */}
      <AboutPhotographer settings={settings} />

      {/* 7. Contact CTA & Inquiry Form */}
      <ContactSection settings={settings} />

      {/* 8. Minimalist Editorial Footer */}
      <Footer />
    </main>
  );
}
