"use client";

import React, { useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { Photo, Category } from "@/lib/db/schema";
import { togglePublishAction, deletePhotoAction } from "@/app/admin/actions";
import { useToast } from "@/components/ui/Toast";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import {
  Search,
  ExternalLink,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Filter,
  Plus,
} from "lucide-react";

interface PhotosTableProps {
  photos: (Photo & { category?: Category | null })[];
  categories: Category[];
}

export function PhotosTable({ photos: initialPhotos, categories }: PhotosTableProps) {
  const toast = useToast();
  const [photos, setPhotos] = useState(initialPhotos);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isPending, startTransition] = useTransition();

  // Custom Delete Modal State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [photoToDelete, setPhotoToDelete] = useState<(Photo & { category?: Category | null }) | null>(null);

  const filteredPhotos = photos.filter((photo) => {
    const matchesSearch =
      photo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (photo.location && photo.location.toLowerCase().includes(searchTerm.toLowerCase())) ||
      photo.slug.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "all" ||
      photo.category?.slug === selectedCategory ||
      photo.categoryId === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleTogglePublish = (id: string, current: boolean, title: string) => {
    startTransition(async () => {
      const res = await togglePublishAction(id, current);
      if (res.success && typeof res.newStatus === "boolean") {
        const updatedStatus = res.newStatus;
        setPhotos((prev) =>
          prev.map((p) => (p.id === id ? { ...p, published: updatedStatus } : p))
        );
        toast.success(
          updatedStatus
            ? `"${title}" is now published live`
            : `"${title}" moved to draft archive`
        );
      } else {
        toast.error(res.error || "Failed to toggle status");
      }
    });
  };

  const openDeleteModal = (photo: Photo & { category?: Category | null }) => {
    setPhotoToDelete(photo);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!photoToDelete) return;
    const photo = photoToDelete;

    startTransition(async () => {
      const res = await deletePhotoAction(photo.id);
      if (res.success) {
        setPhotos((prev) => prev.filter((p) => p.id !== photo.id));
        toast.success(`Photograph "${photo.title}" deleted successfully`);
        setDeleteModalOpen(false);
        setPhotoToDelete(null);
      } else {
        toast.error(res.error || "Failed to delete photograph");
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center bg-white/[0.02] border border-white/10 p-4 rounded">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-canvas/40 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by title, location, slug..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded pl-9 pr-4 py-2 text-xs text-canvas placeholder:text-canvas/30 focus:border-bronze focus:outline-none"
          />
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 bg-white/5 border border-white/10 rounded px-3 py-1.5 text-xs text-canvas">
            <Filter className="w-3.5 h-3.5 text-bronze" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-transparent border-none text-canvas focus:outline-none"
            >
              <option value="all" className="bg-[#111111]">
                All Categories ({photos.length})
              </option>
              {categories.map((c) => (
                <option key={c.id} value={c.slug} className="bg-[#111111]">
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <Link
            href="/admin/photos/new"
            className="inline-flex items-center space-x-1.5 px-4 py-2 bg-bronze text-white text-xs font-medium tracking-ultra uppercase rounded hover:bg-bronze-light transition-colors shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>ADD PHOTO</span>
          </Link>
        </div>
      </div>

      {/* Catalog Table */}
      <div className="border border-white/10 rounded overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-white/[0.04] text-canvas/50 uppercase tracking-widest border-b border-white/10">
            <tr>
              <th className="p-4">Visual</th>
              <th className="p-4">Title & Story</th>
              <th className="p-4">Category</th>
              <th className="p-4">Location & Specs</th>
              <th className="p-4 text-center">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 bg-white/[0.01]">
            {filteredPhotos.map((photo) => (
              <tr key={photo.id} className="hover:bg-white/[0.03] transition-colors">
                <td className="p-4">
                  <div className="relative w-14 h-14 bg-white/5 rounded overflow-hidden">
                    <Image
                      src={photo.imageUrl}
                      alt={photo.imageAlt}
                      fill
                      className="object-cover"
                    />
                  </div>
                </td>
                <td className="p-4 max-w-xs">
                  <Link
                    href={`/admin/photos/${photo.id}`}
                    className="font-serif text-base text-canvas hover:text-bronze transition-colors block font-medium"
                  >
                    {photo.title}
                  </Link>
                  <span className="text-[10px] text-canvas/40 font-mono">/{photo.slug}</span>
                </td>
                <td className="p-4">
                  <span className="text-bronze font-sans uppercase tracking-widest text-[11px]">
                    {photo.category?.name || "Uncategorized"}
                  </span>
                </td>
                <td className="p-4">
                  <p className="text-canvas/80">{photo.location || "—"}</p>
                  <p className="text-[10px] text-canvas/40 font-mono truncate max-w-[160px]">
                    {photo.cameraSpecs || "—"}
                  </p>
                </td>
                <td className="p-4 text-center">
                  <button
                    onClick={() => handleTogglePublish(photo.id, photo.published, photo.title)}
                    disabled={isPending}
                    className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded text-[10px] font-mono transition-colors ${photo.published
                        ? "bg-emerald-400/10 text-emerald-300 border border-emerald-400/20 hover:bg-emerald-400/20"
                        : "bg-rose-400/10 text-rose-300 border border-rose-400/20 hover:bg-rose-400/20"
                      }`}
                  >
                    {photo.published ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                    <span>{photo.published ? "LIVE" : "DRAFT"}</span>
                  </button>
                </td>
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <Link
                      href={`/work/${photo.slug}`}
                      target="_blank"
                      className="p-1.5 text-canvas/60 hover:text-canvas transition-colors"
                      title="View public page"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                    <Link
                      href={`/admin/photos/${photo.id}`}
                      className="p-1.5 text-bronze hover:text-white transition-colors"
                      title="Edit photo"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => openDeleteModal(photo)}
                      disabled={isPending}
                      className="p-1.5 text-rose-400/70 hover:text-rose-400 transition-colors"
                      title="Delete photo"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredPhotos.length === 0 && (
          <div className="p-12 text-center text-canvas/40 space-y-2">
            <p className="font-serif text-lg">No matching photographs found</p>
            <p className="text-xs">Try adjusting your search terms or filter.</p>
          </div>
        )}
      </div>

      {/* Custom Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        title="Remove Photograph"
        message="Are you certain you want to soft-delete this photograph from the archive? It will no longer appear on the live site or gallery."
        itemTitle={photoToDelete ? `${photoToDelete.title} (/${photoToDelete.slug})` : undefined}
        confirmText="DELETE PHOTOGRAPH"
        confirmVariant="danger"
        isPending={isPending}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          if (!isPending) {
            setDeleteModalOpen(false);
            setPhotoToDelete(null);
          }
        }}
      />
    </div>
  );
}
