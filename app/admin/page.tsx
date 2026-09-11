import React from "react";
import Link from "next/link";
import Image from "next/image";
import { getCategories, getPhotos, getSiteSettings } from "@/lib/db/queries";
import { getStorageProvider } from "@/lib/storage";
import {
  Images,
  FolderTree,
  Star,
  Eye,
  Plus,
  ArrowUpRight,
  Database,
  HardDrive,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [photos, categories, settings] = await Promise.all([
    getPhotos({ publishedOnly: false }),
    getCategories(),
    getSiteSettings(),
  ]);

  const totalPhotos = photos.length;
  const publishedPhotos = photos.filter((p) => p.published).length;
  const draftPhotos = totalPhotos - publishedPhotos;
  const totalCategories = categories.length;
  const storage = getStorageProvider();

  return (
    <div className="space-y-10">
      {/* Dashboard Top Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <span className="text-[11px] tracking-ultra text-bronze uppercase">
            STUDIO CONTROL MATRIX
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-light text-canvas">
            Curatorial Dashboard
          </h1>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            href="/admin/photos/new"
            className="inline-flex items-center space-x-2 px-4 py-2.5 bg-bronze text-white text-xs font-medium tracking-ultra uppercase hover:bg-bronze-light transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>NEW PHOTOGRAPH</span>
          </Link>
          <Link
            href="/admin/categories"
            className="inline-flex items-center space-x-2 px-4 py-2.5 border border-white/20 text-canvas text-xs tracking-ultra uppercase hover:border-white transition-colors"
          >
            <FolderTree className="w-3.5 h-3.5" />
            <span>CATEGORIES</span>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white/[0.03] border border-white/10 p-5 rounded space-y-2">
          <div className="flex items-center justify-between text-canvas/50 text-xs">
            <span className="tracking-widest uppercase">TOTAL PHOTOGRAPHS</span>
            <Images className="w-4 h-4 text-bronze" />
          </div>
          <p className="font-serif text-3xl sm:text-4xl text-canvas">{totalPhotos}</p>
          <p className="text-[10px] text-canvas/40 tracking-wider">Indexed in database</p>
        </div>

        <div className="bg-white/[0.03] border border-white/10 p-5 rounded space-y-2">
          <div className="flex items-center justify-between text-canvas/50 text-xs">
            <span className="tracking-widest uppercase">LIVE ON WEBSITE</span>
            <Eye className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="font-serif text-3xl sm:text-4xl text-canvas">{publishedPhotos}</p>
          <p className="text-[10px] text-canvas/40 tracking-wider">Publicly visible</p>
        </div>

        <div className="bg-white/[0.03] border border-white/10 p-5 rounded space-y-2">
          <div className="flex items-center justify-between text-canvas/50 text-xs">
            <span className="tracking-widest uppercase">DRAFT ARCHIVE</span>
            <Images className="w-4 h-4 text-amber-400" />
          </div>
          <p className="font-serif text-3xl sm:text-4xl text-canvas">{draftPhotos}</p>
          <p className="text-[10px] text-canvas/40 tracking-wider">Unpublished works</p>
        </div>

        <div className="bg-white/[0.03] border border-white/10 p-5 rounded space-y-2">
          <div className="flex items-center justify-between text-canvas/50 text-xs">
            <span className="tracking-widest uppercase">CATEGORIES</span>
            <FolderTree className="w-4 h-4 text-sky-400" />
          </div>
          <p className="font-serif text-3xl sm:text-4xl text-canvas">{totalCategories}</p>
          <p className="text-[10px] text-canvas/40 tracking-wider">Portfolio taxonomy</p>
        </div>
      </div>

      {/* Storage & Environment Status Box */}
      <div className="bg-white/[0.02] border border-white/10 p-5 rounded flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
        <div className="flex items-center space-x-6 font-mono text-[11px]">
          <div className="flex items-center space-x-2">
            <Database className="w-4 h-4 text-emerald-400" />
            <span className="text-canvas/60">DATABASE:</span>
            <span className="text-canvas">{process.env.DATABASE_URL ? "PostgreSQL / Neon" : "Drizzle PostgreSQL"}</span>
          </div>
          <div className="flex items-center space-x-2">
            <HardDrive className="w-4 h-4 text-bronze" />
            <span className="text-canvas/60">STORAGE LAYER:</span>
            <span className="text-canvas uppercase">{storage.name}</span>
          </div>
        </div>

        <span className="text-[10px] tracking-ultra text-emerald-400 uppercase bg-emerald-400/10 px-2.5 py-1 rounded border border-emerald-400/20">
          SYSTEM OPERATIONAL
        </span>
      </div>

      {/* Recent Photographs Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-xl sm:text-2xl font-light text-canvas">
            Recent Catalog Entries
          </h2>
          <Link
            href="/admin/photos"
            className="text-xs tracking-ultra text-bronze uppercase hover:underline"
          >
            VIEW ALL ({totalPhotos}) →
          </Link>
        </div>

        <div className="border border-white/10 rounded overflow-hidden">
          <div className="divide-y divide-white/5 bg-white/[0.02]">
            {photos.slice(0, 6).map((photo) => (
              <div
                key={photo.id}
                className="p-4 flex items-center justify-between hover:bg-white/[0.04] transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="relative w-12 h-12 bg-white/5 shrink-0 overflow-hidden rounded">
                    <Image
                      src={photo.imageUrl}
                      alt={photo.imageAlt}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <Link
                      href={`/admin/photos/${photo.id}`}
                      className="font-serif text-base sm:text-lg text-canvas hover:text-bronze transition-colors"
                    >
                      {photo.title}
                    </Link>
                    <p className="text-[11px] text-canvas/50 uppercase tracking-widest">
                      {photo.category?.name || "Uncategorized"} • {photo.location || "Worldwide"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 text-xs font-mono">
                  {photo.published ? (
                    <span className="bg-emerald-400/10 text-emerald-300 border border-emerald-400/20 px-2 py-0.5 rounded text-[10px]">
                      PUBLISHED
                    </span>
                  ) : (
                    <span className="bg-rose-400/10 text-rose-300 border border-rose-400/20 px-2 py-0.5 rounded text-[10px]">
                      DRAFT
                    </span>
                  )}
                  <Link
                    href={`/admin/photos/${photo.id}`}
                    className="text-bronze hover:underline"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
