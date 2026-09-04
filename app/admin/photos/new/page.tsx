import React from "react";
import { getCategories } from "@/lib/db/queries";
import { PhotoForm } from "@/components/admin/PhotoForm";

export const dynamic = "force-dynamic";

export default async function NewPhotoPage() {
  const categories = await getCategories();

  return (
    <div className="space-y-8">
      <div>
        <span className="text-[11px] tracking-ultra text-bronze uppercase">
          CATALOG CURATION
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-light text-canvas">
          Register New Photograph
        </h1>
      </div>

      <PhotoForm categories={categories} />
    </div>
  );
}
