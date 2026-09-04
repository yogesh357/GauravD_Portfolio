import React from "react";
import { getCategories, getPhotos } from "@/lib/db/queries";
import { CategoriesManager } from "@/components/admin/CategoriesManager";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const [categories, photos] = await Promise.all([
    getCategories(),
    getPhotos({ publishedOnly: false }),
  ]);

  return (
    <div className="space-y-8">
      <div className="border-b border-white/10 pb-6">
        <span className="text-[11px] tracking-ultra text-bronze uppercase">
          PORTFOLIO TAXONOMY
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-light text-canvas">
          Category Architecture
        </h1>
        <p className="text-xs text-canvas/60 mt-1">
          Add, edit, and organize visual collection categories. The public gallery filter updates dynamically.
        </p>
      </div>

      <CategoriesManager categories={categories} photos={photos} />
    </div>
  );
}
