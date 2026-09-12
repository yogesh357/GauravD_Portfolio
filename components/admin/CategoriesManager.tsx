"use client";

import React, { useState, useTransition } from "react";
import { Category, Photo } from "@/lib/db/schema";
import { saveCategoryAction, deleteCategoryAction } from "@/app/admin/actions";
import { slugify } from "@/lib/utils";
import { useToast } from "@/components/ui/Toast";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { Plus, Edit2, Trash2, Check, AlertCircle } from "lucide-react";

interface CategoriesManagerProps {
  categories: Category[];
  photos: Photo[];
}

export function CategoriesManager({
  categories: initialCategories,
  photos,
}: CategoriesManagerProps) {
  const toast = useToast();
  const [categories, setCategories] = useState(initialCategories);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [displayOrder, setDisplayOrder] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Custom Delete Modal State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setName(val);
    if (!editingId) {
      setSlug(slugify(val));
    }
  };

  const handleEditClick = (cat: Category) => {
    setEditingId(cat.id);
    setName(cat.name);
    setSlug(cat.slug);
    setDescription(cat.description || "");
    setDisplayOrder(cat.displayOrder);
  };

  const handleCancel = () => {
    setEditingId(null);
    setName("");
    setSlug("");
    setDescription("");
    setDisplayOrder(0);
    setErrorMsg(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const formData = new FormData();
    if (editingId) formData.append("id", editingId);
    formData.append("name", name);
    formData.append("slug", slug);
    formData.append("description", description);
    formData.append("displayOrder", String(displayOrder));

    startTransition(async () => {
      const res = await saveCategoryAction(formData);
      if (res.success) {
        if (editingId) {
          setCategories((prev) =>
            prev.map((c) =>
              c.id === editingId
                ? { ...c, name, slug, description, displayOrder }
                : c
            )
          );
          toast.success(`Category "${name}" updated successfully`);
        } else {
          setCategories((prev) => [
            ...prev,
            {
              id: `cat-${Date.now()}`,
              name,
              slug,
              description,
              displayOrder,
              isDeleted: false,
              deletedAt: null,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          ]);
          toast.success(`Category "${name}" created successfully`);
        }
        handleCancel();
      } else {
        const err = res.error || "Failed to save category";
        setErrorMsg(err);
        toast.error(err);
      }
    });
  };

  const openDeleteModal = (cat: Category) => {
    const count = photos.filter((p) => p.categoryId === cat.id && !p.isDeleted).length;
    if (count > 0) {
      toast.error(
        `Cannot delete "${cat.name}": Contains ${count} active photograph(s). Please delete or reassign them first.`
      );
      return;
    }
    setCategoryToDelete(cat);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!categoryToDelete) return;
    const cat = categoryToDelete;

    startTransition(async () => {
      const res = await deleteCategoryAction(cat.id);
      if (res.success) {
        setCategories((prev) => prev.filter((c) => c.id !== cat.id));
        toast.success(`Category "${cat.name}" removed successfully`);
        setDeleteModalOpen(false);
        setCategoryToDelete(null);
      } else {
        const err = res.error || "Failed to delete category";
        toast.error(err);
      }
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
      {/* Category List */}
      <div className="lg:col-span-7 space-y-4">
        <p className="text-xs tracking-ultra uppercase text-bronze">
          EXISTING CATEGORIES ({categories.length})
        </p>

        <div className="border border-white/10 rounded overflow-hidden divide-y divide-white/5 bg-white/[0.02]">
          {categories.map((cat) => {
            const photoCount = photos.filter(
              (p) => p.categoryId === cat.id
            ).length;

            return (
              <div
                key={cat.id}
                className="p-5 flex items-start justify-between hover:bg-white/[0.03] transition-colors"
              >
                <div className="space-y-1 max-w-md">
                  <div className="flex items-center space-x-3">
                    <span className="font-serif text-lg text-canvas">{cat.name}</span>
                    <span className="font-mono text-xs text-bronze">/{cat.slug}</span>
                    <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-canvas/70">
                      {photoCount} photos
                    </span>
                  </div>
                  {cat.description && (
                    <p className="text-xs text-canvas/60 font-light leading-relaxed">
                      {cat.description}
                    </p>
                  )}
                  <p className="text-[10px] text-canvas/40 font-mono">
                    Priority order: {cat.displayOrder}
                  </p>
                </div>

                <div className="flex items-center space-x-2 pt-1">
                  <button
                    onClick={() => handleEditClick(cat)}
                    className="p-1.5 text-bronze hover:text-white transition-colors"
                    title="Edit category"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => openDeleteModal(cat)}
                    className="p-1.5 text-rose-400/70 hover:text-rose-400 transition-colors"
                    title="Delete category"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Category Creation / Edit Form */}
      <div className="lg:col-span-5">
        <div className="bg-white/[0.03] border border-white/10 p-6 rounded space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <span className="text-xs tracking-ultra text-bronze uppercase">
              {editingId ? "EDIT CATEGORY" : "ADD NEW CATEGORY"}
            </span>
            {editingId && (
              <button
                onClick={handleCancel}
                className="text-[10px] tracking-widest text-canvas/60 hover:text-canvas uppercase"
              >
                CANCEL EDIT
              </button>
            )}
          </div>

          {errorMsg && (
            <div className="bg-rose-500/10 border border-rose-500/20 p-3 rounded flex items-center space-x-2 text-xs text-rose-300">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-widest text-canvas/70 mb-1.5">
                Category Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Architecture"
                value={name}
                onChange={handleNameChange}
                className="w-full bg-white/5 border border-white/15 px-3 py-2 rounded text-xs text-canvas focus:border-bronze focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest text-canvas/70 mb-1.5">
                URL Slug *
              </label>
              <input
                type="text"
                required
                placeholder="architecture"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full bg-white/5 border border-white/15 px-3 py-2 rounded text-xs font-mono text-bronze focus:border-bronze focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest text-canvas/70 mb-1.5">
                Editorial Description
              </label>
              <textarea
                rows={3}
                placeholder="Brief curatorial definition for the category..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-white/5 border border-white/15 px-3 py-2 rounded text-xs text-canvas focus:border-bronze focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest text-canvas/70 mb-1.5">
                Display Order Priority
              </label>
              <input
                type="number"
                value={displayOrder}
                onChange={(e) => setDisplayOrder(Number(e.target.value))}
                className="w-full bg-white/5 border border-white/15 px-3 py-2 rounded text-xs text-canvas focus:border-bronze focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full inline-flex items-center justify-center space-x-2 py-3 bg-bronze text-white text-xs font-medium tracking-ultra uppercase hover:bg-bronze-light transition-colors"
            >
              <Check className="w-4 h-4" />
              <span>{editingId ? "UPDATE CATEGORY" : "CREATE CATEGORY"}</span>
            </button>
          </form>
        </div>
      </div>

      {/* Custom Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        title="Remove Category"
        message="Are you certain you want to soft-delete this category archive? This action can only proceed if no active photos are attached."
        itemTitle={categoryToDelete ? `${categoryToDelete.name} (/${categoryToDelete.slug})` : undefined}
        confirmText="DELETE CATEGORY"
        confirmVariant="danger"
        isPending={isPending}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          if (!isPending) {
            setDeleteModalOpen(false);
            setCategoryToDelete(null);
          }
        }}
      />
    </div>
  );
}
