import React from "react";
import { notFound } from "next/navigation";
import { getPhotoById, getCategories } from "@/lib/db/queries";
import { PhotoForm } from "@/components/admin/PhotoForm";

export const dynamic = "force-dynamic";

interface Props {
  params: { id: string };
}

export default async function EditPhotoPage({ params }: Props) {
  const [photo, categories] = await Promise.all([
    getPhotoById(params.id),
    getCategories(),
  ]);

  if (!photo) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <div>
        <span className="text-[11px] tracking-ultra text-bronze uppercase">
          CATALOG CURATION
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-light text-canvas">
          Edit Photograph & Metadata
        </h1>
      </div>

      <PhotoForm initialPhoto={photo} categories={categories} />
    </div>
  );
}
