import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { getPhotoBySlug, getPhotos } from "@/lib/db/queries";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ArrowLeft, ArrowRight, ArrowUpRight, Camera, MapPin, Calendar, Tag } from "lucide-react";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const photo = await getPhotoBySlug(params.slug);
  if (!photo) {
    return {
      title: "Photograph Not Found — Gaurav ",
    };
  }

  return {
    title: `${photo.title} — Gaurav  Photography`,
    description: photo.description || `Fine art photograph by Gaurav captured in ${photo.location || "Europe"}.`,
    openGraph: {
      title: `${photo.title} — Gaurav  Photography`,
      description: photo.description || "Fine art photography framed in light.",
      images: [
        {
          url: photo.imageUrl,
          width: 1600,
          height: 1066,
          alt: photo.imageAlt,
        },
      ],
    },
  };
}

export default async function PhotoDetailPage({ params }: Props) {
  const photo = await getPhotoBySlug(params.slug);
  if (!photo) {
    notFound();
  }

  const allPhotos = await getPhotos({ publishedOnly: true });
  const currentIndex = allPhotos.findIndex((p) => p.slug === params.slug);

  const prevPhoto = currentIndex > 0 ? allPhotos[currentIndex - 1] : allPhotos[allPhotos.length - 1];
  const nextPhoto = currentIndex < allPhotos.length - 1 ? allPhotos[currentIndex + 1] : allPhotos[0];

  return (
    <div className="min-h-screen bg-canvas text-ink flex flex-col justify-between">
      <Navbar />

      <main className="pt-28 sm:pt-36 pb-24 px-6 sm:px-12 max-w-7xl mx-auto w-full">
        {/* Top Back Navigation Breadcrumb */}
        <div className="mb-10 flex items-center justify-between border-b border-ink/10 pb-4 text-xs tracking-ultra uppercase text-ink-muted">
          <Link
            href="/work"
            className="group inline-flex items-center space-x-2 text-ink hover:text-bronze transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
            <span>BACK TO ARCHIVE</span>
          </Link>
          <span>
            {photo.category?.name || "PORTFOLIO"} / {currentIndex + 1} OF {allPhotos.length}
          </span>
        </div>

        {/* Hero Artwork Frame */}
        <div className="relative w-full bg-canvas-muted overflow-hidden mb-12">
          <div
            className={`relative w-full ${photo.aspectRatio === "16/10"
                ? "aspect-[16/10] sm:aspect-[16/9]"
                : "aspect-[4/5] sm:aspect-[16/10] max-h-[82vh]"
              }`}
          >
            <Image
              src={photo.imageUrl}
              alt={photo.imageAlt}
              fill
              priority
              sizes="(max-width: 1280px) 100vw, 1280px"
              className="object-contain sm:object-cover bg-black/5"
            />
          </div>
        </div>

        {/* Detailed Metadata and Editorial Narrative */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 pt-6">
          {/* Left Column: Title and Narrative */}
          <div className="lg:col-span-7 flex flex-col space-y-6">
            <span className="text-xs font-sans tracking-ultra uppercase text-bronze">
              {photo.category?.name || "PORTFOLIO"} • {photo.location || "PARIS"}
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-light text-ink leading-tight">
              {photo.title}
            </h1>
            <p className="text-ink-muted text-base sm:text-lg leading-relaxed font-light pt-2">
              {photo.description ||
                "An exploration of light, texture, and silence captured during fleeting moments of organic balance."}
            </p>
          </div>

          {/* Right Column: EXIF & Curatorial Specifications */}
          <div className="lg:col-span-5 bg-canvas-muted/60 border border-ink/10 p-8 flex flex-col justify-between space-y-8">
            <p className="text-xs tracking-ultra uppercase text-bronze border-b border-ink/10 pb-3">
              TECHNICAL & CURATORIAL EXIF
            </p>

            <div className="space-y-4 text-xs font-mono">
              {photo.cameraSpecs && (
                <div className="flex items-start space-x-3">
                  <Camera className="w-4 h-4 text-bronze mt-0.5 shrink-0" />
                  <div>
                    <p className="text-ink-muted uppercase text-[10px] tracking-widest font-sans">
                      CAMERA & OPTICS
                    </p>
                    <p className="text-ink font-medium">{photo.cameraSpecs}</p>
                  </div>
                </div>
              )}

              {photo.location && (
                <div className="flex items-start space-x-3">
                  <MapPin className="w-4 h-4 text-bronze mt-0.5 shrink-0" />
                  <div>
                    <p className="text-ink-muted uppercase text-[10px] tracking-widest font-sans">
                      GEOGRAPHIC COORDINATE
                    </p>
                    <p className="text-ink font-medium">{photo.location}</p>
                  </div>
                </div>
              )}

              {photo.shotAt && (
                <div className="flex items-start space-x-3">
                  <Calendar className="w-4 h-4 text-bronze mt-0.5 shrink-0" />
                  <div>
                    <p className="text-ink-muted uppercase text-[10px] tracking-widest font-sans">
                      CAPTURE DATE
                    </p>
                    <p className="text-ink font-medium">{photo.shotAt}</p>
                  </div>
                </div>
              )}

              <div className="flex items-start space-x-3">
                <Tag className="w-4 h-4 text-bronze mt-0.5 shrink-0" />
                <div>
                  <p className="text-ink-muted uppercase text-[10px] tracking-widest font-sans">
                    EDITION & PRINT FORMAT
                  </p>
                  <p className="text-ink font-medium">Hahnemühle Photo Rag • Edition of 12 + 2 AP</p>
                </div>
              </div>
            </div>

            <a
              href={`/#contact`}
              className="inline-flex items-center justify-center space-x-2 w-full py-3 bg-ink text-canvas text-xs font-medium tracking-ultra uppercase hover:bg-bronze transition-colors"
            >
              <span>INQUIRE ABOUT THIS PRINT</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Previous / Next Project Navigation Bar */}
        <div className="mt-20 pt-8 border-t border-ink/10 grid grid-cols-1 sm:grid-cols-2 gap-8">
          {prevPhoto && (
            <Link
              href={`/work/${prevPhoto.slug}`}
              className="group flex items-center space-x-4 p-4 border border-ink/10 hover:border-ink transition-colors bg-canvas-muted/30"
            >
              <div className="relative w-16 h-16 shrink-0 overflow-hidden bg-canvas-muted">
                <Image
                  src={prevPhoto.imageUrl}
                  alt={prevPhoto.imageAlt}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="overflow-hidden">
                <p className="text-[10px] tracking-ultra text-bronze uppercase flex items-center space-x-1">
                  <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
                  <span>PREVIOUS PHOTOGRAPH</span>
                </p>
                <p className="font-serif text-lg text-ink truncate group-hover:text-bronze transition-colors">
                  {prevPhoto.title}
                </p>
              </div>
            </Link>
          )}

          {nextPhoto && (
            <Link
              href={`/work/${nextPhoto.slug}`}
              className="group flex items-center justify-between sm:justify-end space-x-4 p-4 border border-ink/10 hover:border-ink transition-colors bg-canvas-muted/30 text-right"
            >
              <div className="overflow-hidden">
                <p className="text-[10px] tracking-ultra text-bronze uppercase flex items-center justify-end space-x-1">
                  <span>NEXT PHOTOGRAPH</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </p>
                <p className="font-serif text-lg text-ink truncate group-hover:text-bronze transition-colors">
                  {nextPhoto.title}
                </p>
              </div>
              <div className="relative w-16 h-16 shrink-0 overflow-hidden bg-canvas-muted">
                <Image
                  src={nextPhoto.imageUrl}
                  alt={nextPhoto.imageAlt}
                  fill
                  className="object-cover"
                />
              </div>
            </Link>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
