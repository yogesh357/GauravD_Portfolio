"use client";

import React, { useState, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Photo, Category } from "@/lib/db/schema";
import { savePhotoAction } from "@/app/admin/actions";
import { slugify } from "@/lib/utils";
import { useToast } from "@/components/ui/Toast";
import { Upload, ArrowLeft, Check, AlertCircle, RefreshCw, CheckCircle2 } from "lucide-react";
import Link from "next/link";

interface PhotoFormProps {
  initialPhoto?: Photo | null;
  categories: Category[];
}

export function PhotoForm({ initialPhoto, categories }: PhotoFormProps) {
  const router = useRouter();
  const toast = useToast();
  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const [title, setTitle] = useState(initialPhoto?.title || "");
  const [slug, setSlug] = useState(initialPhoto?.slug || "");
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(!!initialPhoto?.slug);
  const [description, setDescription] = useState(initialPhoto?.description || "");
  const [imageUrl, setImageUrl] = useState(initialPhoto?.imageUrl || "");
  const [imageAlt, setImageAlt] = useState(initialPhoto?.imageAlt || "");
  const [categoryId, setCategoryId] = useState(
    initialPhoto?.categoryId || categories[0]?.id || ""
  );
  const [location, setLocation] = useState(initialPhoto?.location || "");
  const [shotAt, setShotAt] = useState(initialPhoto?.shotAt || "");
  const [cameraSpecs, setCameraSpecs] = useState(initialPhoto?.cameraSpecs || "");
  const [aspectRatio, setAspectRatio] = useState(initialPhoto?.aspectRatio || "4/5");
  const [published, setPublished] = useState(initialPhoto?.published ?? true);
  const [displayOrder, setDisplayOrder] = useState(initialPhoto?.displayOrder ?? 0);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    if (!isSlugManuallyEdited) {
      setSlug(slugify(newTitle));
    }
    if (!imageAlt) {
      setImageAlt(`Fine art photography of ${newTitle}`);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadSuccess(false);
    setErrorMsg(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const contentType = res.headers.get("content-type") || "";
      let data: any = null;

      if (contentType.includes("application/json")) {
        data = await res.json();
      } else {
        const textResponse = await res.text();
        if (res.status === 413) {
          throw new Error(
            "File is too large for the server (HTTP 413 Request Entity Too Large). Please increase 'client_max_body_size 50M;' in your Nginx configuration on EC2, or upload an image under 10MB."
          );
        }
        throw new Error(
          `Server returned non-JSON error (HTTP ${res.status}): ${textResponse.slice(0, 150)}`
        );
      }

      if (!res.ok) {
        throw new Error(data?.error || `Upload failed with status ${res.status}`);
      }

      if (!data?.url) {
        throw new Error("No image URL returned from upload server");
      }

      setImageUrl(data.url);
      setUploadSuccess(true);
      toast.success("Photograph uploaded successfully to secure storage");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to upload file";
      setErrorMsg(msg);
      toast.error(msg);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!imageUrl) {
      const msg = "Please upload an image for this photograph before saving.";
      setErrorMsg(msg);
      toast.error(msg);
      return;
    }

    const formData = new FormData();
    if (initialPhoto?.id) {
      formData.append("id", initialPhoto.id);
    }
    formData.append("title", title);
    formData.append("slug", slug);
    formData.append("description", description);
    formData.append("imageUrl", imageUrl);
    formData.append("imageAlt", imageAlt || title);
    formData.append("categoryId", categoryId);
    formData.append("location", location);
    formData.append("shotAt", shotAt);
    formData.append("cameraSpecs", cameraSpecs);
    formData.append("aspectRatio", aspectRatio);
    formData.append("published", published ? "true" : "false");
    formData.append("displayOrder", String(displayOrder));

    startTransition(async () => {
      const res = await savePhotoAction(formData);
      if (res.success) {
        toast.success(
          initialPhoto
            ? `Photograph "${title}" updated successfully`
            : `Photograph "${title}" registered successfully`
        );
        router.push("/admin/photos");
        router.refresh();
      } else {
        const msg = res.error || "Failed to save photograph";
        setErrorMsg(msg);
        toast.error(msg);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      {/* Form Navigation Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <Link
          href="/admin/photos"
          className="inline-flex items-center space-x-2 text-xs tracking-widest text-canvas/60 hover:text-canvas transition-colors uppercase"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>RETURN TO INVENTORY</span>
        </Link>
        <span className="text-xs text-bronze uppercase tracking-ultra font-mono">
          {initialPhoto ? "EDITING ENTRY" : "NEW PHOTOGRAPH REGISTRATION"}
        </span>
      </div>

      {errorMsg && (
        <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded flex items-center space-x-3 text-xs text-rose-300">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Essential Metadata */}
        <div className="lg:col-span-7 space-y-6">
          <div>
            <label className="block text-xs font-sans tracking-widest uppercase text-canvas/70 mb-2">
              Photograph Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Between Shadows & Solitude"
              value={title}
              onChange={handleTitleChange}
              className="w-full bg-white/5 border border-white/15 px-4 py-3 rounded text-sm text-canvas placeholder:text-canvas/30 focus:border-bronze focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-sans tracking-widest uppercase text-canvas/70 mb-2">
                URL Slug *
              </label>
              <input
                type="text"
                required
                placeholder="between-shadows-and-solitude"
                value={slug}
                onChange={(e) => {
                  setSlug(e.target.value);
                  setIsSlugManuallyEdited(true);
                }}
                className="w-full bg-white/5 border border-white/15 px-4 py-2.5 rounded text-xs font-mono text-bronze focus:border-bronze focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-sans tracking-widest uppercase text-canvas/70 mb-2">
                Category *
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full bg-[#111111] border border-white/15 px-4 py-2.5 rounded text-xs text-canvas focus:border-bronze focus:outline-none"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-sans tracking-widest uppercase text-canvas/70 mb-2">
              Curatorial Description / Narrative Story
            </label>
            <textarea
              rows={4}
              placeholder="Describe the atmosphere, lighting, artistic narrative, or context..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-white/5 border border-white/15 px-4 py-3 rounded text-sm text-canvas placeholder:text-canvas/30 focus:border-bronze focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-sans tracking-widest uppercase text-canvas/70 mb-2">
                Location
              </label>
              <input
                type="text"
                placeholder="e.g. Pune, Maharashtra"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-white/5 border border-white/15 px-4 py-2.5 rounded text-xs text-canvas focus:border-bronze focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-sans tracking-widest uppercase text-canvas/70 mb-2">
                Shooting Date
              </label>
              <input
                type="text"
                placeholder="e.g. October 2025"
                value={shotAt}
                onChange={(e) => setShotAt(e.target.value)}
                className="w-full bg-white/5 border border-white/15 px-4 py-2.5 rounded text-xs text-canvas focus:border-bronze focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-sans tracking-widest uppercase text-canvas/70 mb-2">
              Camera & Optics EXIF Specs
            </label>
            <input
              type="text"
              placeholder="e.g. Canon M50 Mark II • EF-M 22mm f/2 STM • 1/500s f/2.8 ISO 100"
              value={cameraSpecs}
              onChange={(e) => setCameraSpecs(e.target.value)}
              className="w-full bg-white/5 border border-white/15 px-4 py-2.5 rounded text-xs font-mono text-canvas/90 focus:border-bronze focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-sans tracking-widest uppercase text-canvas/70 mb-2">
                Aspect Ratio
              </label>
              <select
                value={aspectRatio}
                onChange={(e) => setAspectRatio(e.target.value)}
                className="w-full bg-[#111111] border border-white/15 px-4 py-2.5 rounded text-xs text-canvas focus:border-bronze focus:outline-none"
              >
                <option value="4/5">4:5 Vertical Portrait</option>
                <option value="16/10">16:10 Cinematic Landscape</option>
                <option value="3/4">3:4 Classic Medium</option>
                <option value="1/1">1:1 Fine Art Square</option>
                <option value="2/3">2:3 Standard 35mm</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-sans tracking-widest uppercase text-canvas/70 mb-2">
                Display Order Priority
              </label>
              <input
                type="number"
                value={displayOrder}
                onChange={(e) => setDisplayOrder(Number(e.target.value))}
                className="w-full bg-white/5 border border-white/15 px-4 py-2.5 rounded text-xs text-canvas focus:border-bronze focus:outline-none"
              />
            </div>
          </div>

          {/* Published Switch */}
          <div className="pt-4 border-t border-white/10">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
                className="w-4 h-4 rounded border-white/20 accent-bronze"
              />
              <span className="text-xs font-sans tracking-widest uppercase text-canvas">
                PUBLISH TO LIVE SITE
              </span>
            </label>
          </div>
        </div>

        {/* Right Column: Direct File Upload & Live Preview */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white/[0.02] border border-white/10 p-6 rounded space-y-5">
            <div className="flex items-center justify-between">
              <p className="text-xs tracking-ultra uppercase text-bronze font-mono">
                IMAGE UPLOAD (CLOUDINARY / STORAGE)
              </p>
              {imageUrl && (
                <span className="inline-flex items-center space-x-1 text-[10px] text-emerald-400 font-mono">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>UPLOADED</span>
                </span>
              )}
            </div>

            {/* Direct File Dropzone */}
            <div className="relative flex items-center justify-center">
              <label className="w-full flex flex-col items-center justify-center p-8 border-2 border-dashed border-white/15 hover:border-bronze rounded cursor-pointer transition-all bg-white/[0.01] hover:bg-white/[0.03]">
                {uploading ? (
                  <div className="flex flex-col items-center space-y-3 py-2">
                    <RefreshCw className="w-8 h-8 text-bronze animate-spin" />
                    <span className="text-xs font-mono tracking-widest uppercase text-canvas/80">
                      UPLOADING TO STORAGE...
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center space-y-2 py-2 text-center">
                    <Upload className="w-8 h-8 text-bronze mb-1" />
                    <span className="text-xs font-medium tracking-widest uppercase text-canvas">
                      {imageUrl ? "CLICK TO REPLACE IMAGE FILE" : "SELECT OR DROP IMAGE FILE"}
                    </span>
                    <span className="text-[10px] text-canvas/40 font-mono">
                      JPEG, PNG, WebP up to 10MB &bull; Automatic Optimization
                    </span>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  disabled={uploading}
                  className="hidden"
                />
              </label>
            </div>

            {imageUrl && (
              <div className="p-3 bg-white/5 rounded border border-white/10 text-[11px] font-mono text-canvas/70 break-all">
                <span className="text-bronze text-[10px] block uppercase tracking-widest mb-1">
                  SECURE STORAGE URL
                </span>
                {imageUrl}
              </div>
            )}

            <div>
              <label className="block text-[11px] uppercase tracking-widest text-canvas/50 mb-1.5">
                Accessible Alt Text *
              </label>
              <input
                type="text"
                required
                placeholder="Descriptive visual alt tag"
                value={imageAlt}
                onChange={(e) => setImageAlt(e.target.value)}
                className="w-full bg-white/5 border border-white/15 px-3 py-2 rounded text-xs text-canvas focus:border-bronze focus:outline-none"
              />
            </div>
          </div>

          {/* Live Preview Card */}
          <div className="space-y-2">
            <p className="text-[11px] tracking-ultra text-canvas/50 uppercase font-mono">
              LIVE EDITORIAL PREVIEW
            </p>
            <div className="border border-white/10 p-4 rounded bg-white/[0.02]">
              <div
                className={`relative w-full rounded overflow-hidden bg-black/40 ${
                  aspectRatio === "16/10" ? "aspect-[16/10]" : "aspect-[4/5]"
                }`}
              >
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt={imageAlt || "Preview"}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-canvas/30 text-xs tracking-widest uppercase">
                    No image uploaded yet
                  </div>
                )}
              </div>
              <div className="mt-3">
                <span className="text-[10px] tracking-ultra text-bronze uppercase font-mono">
                  {categories.find((c) => c.id === categoryId)?.name || "CATEGORY"} • {location || "LOCATION"}
                </span>
                <p className="font-serif text-lg text-canvas truncate mt-0.5">
                  {title || "Photograph Title"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Submission Buttons */}
      <div className="flex items-center justify-end space-x-4 border-t border-white/10 pt-6">
        <Link
          href="/admin/photos"
          className="px-6 py-3 border border-white/20 text-canvas text-xs tracking-ultra uppercase hover:border-white transition-colors"
        >
          CANCEL
        </Link>
        <button
          type="submit"
          disabled={isPending || uploading || !imageUrl}
          className="inline-flex items-center space-x-2 px-8 py-3 bg-bronze text-white text-xs font-medium tracking-ultra uppercase hover:bg-bronze-light disabled:opacity-50 transition-colors"
        >
          <Check className="w-4 h-4" />
          <span>{isPending ? "SAVING RECORD..." : initialPhoto ? "UPDATE PHOTOGRAPH" : "REGISTER PHOTOGRAPH"}</span>
        </button>
      </div>
    </form>
  );
}
