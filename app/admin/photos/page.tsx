import React from "react";
import { getPhotos, getCategories } from "@/lib/db/queries";
import { PhotosTable } from "@/components/admin/PhotosTable";

export const dynamic = "force-dynamic";

export default async function AdminPhotosPage() {
  const [photos, categories] = await Promise.all([
    getPhotos({ publishedOnly: false }),
    getCategories(),
  ]);

  return (
    <div className="space-y-8">
      <div className="border-b border-white/10 pb-6">
        <span className="text-[11px] tracking-ultra text-bronze uppercase">
          CATALOG ARCHIVE
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-light text-canvas">
          Photographic Inventory
        </h1>
        <p className="text-xs text-canvas/60 mt-1">
          Manage photographic titles, EXIF specifications, categories, and public display statuses.
        </p>
      </div>

      <PhotosTable photos={photos} categories={categories} />
    </div>
  );
}
