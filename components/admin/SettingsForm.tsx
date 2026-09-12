"use client";

import React, { useState, useTransition } from "react";
import { SiteSettings } from "@/lib/db/schema";
import { updateSettingsAction } from "@/app/admin/actions";
import { useToast } from "@/components/ui/Toast";
import { Check, AlertCircle } from "lucide-react";

interface SettingsFormProps {
  settings: SiteSettings;
}

export function SettingsForm({ settings }: SettingsFormProps) {
  const toast = useToast();
  const [isPending, startTransition] = useTransition();
  const [successMsg, setSuccessMsg] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [photographerName, setPhotographerName] = useState(settings.photographerName);
  const [tagline, setTagline] = useState(settings.tagline);
  const [bio, setBio] = useState(settings.bio);
  const [email, setEmail] = useState(settings.email);
  const [instagram, setInstagram] = useState(settings.instagram);
  const [phone, setPhone] = useState(settings.phone || "");
  const [location, setLocation] = useState(settings.location);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg(false);
    setErrorMsg(null);

    const formData = new FormData();
    formData.append("photographerName", photographerName);
    formData.append("tagline", tagline);
    formData.append("bio", bio);
    formData.append("email", email);
    formData.append("instagram", instagram);
    formData.append("phone", phone);
    formData.append("location", location);

    startTransition(async () => {
      const res = await updateSettingsAction(formData);
      if (res.success) {
        setSuccessMsg(true);
        toast.success("Studio settings updated successfully across the website");
        setTimeout(() => setSuccessMsg(false), 4000);
      } else {
        const msg = res.error || "Failed to update settings";
        setErrorMsg(msg);
        toast.error(msg);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
      {successMsg && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded flex items-center space-x-2 text-xs text-emerald-300">
          <Check className="w-4 h-4 shrink-0" />
          <span>Studio settings updated successfully across the website.</span>
        </div>
      )}

      {errorMsg && (
        <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded flex items-center space-x-2 text-xs text-rose-300">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="bg-white/[0.02] border border-white/10 p-6 sm:p-8 rounded space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs uppercase tracking-widest text-canvas/70 mb-2">
              Photographer Name / Wordmark *
            </label>
            <input
              type="text"
              required
              value={photographerName}
              onChange={(e) => setPhotographerName(e.target.value)}
              className="w-full bg-white/5 border border-white/15 px-4 py-2.5 rounded text-xs text-canvas focus:border-bronze focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-canvas/70 mb-2">
              Hero Editorial Tagline *
            </label>
            <input
              type="text"
              required
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className="w-full bg-white/5 border border-white/15 px-4 py-2.5 rounded text-xs text-canvas focus:border-bronze focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs uppercase tracking-widest text-canvas/70 mb-2">
            Artist Biography / Philosophy Statement *
          </label>
          <textarea
            rows={4}
            required
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full bg-white/5 border border-white/15 px-4 py-3 rounded text-sm text-canvas focus:border-bronze focus:outline-none leading-relaxed"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs uppercase tracking-widest text-canvas/70 mb-2">
              Direct Contact Email *
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white/5 border border-white/15 px-4 py-2.5 rounded text-xs text-canvas focus:border-bronze focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-canvas/70 mb-2">
              Studio Phone Number
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-white/5 border border-white/15 px-4 py-2.5 rounded text-xs text-canvas focus:border-bronze focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs uppercase tracking-widest text-canvas/70 mb-2">
              Instagram Profile URL *
            </label>
            <input
              type="url"
              required
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
              className="w-full bg-white/5 border border-white/15 px-4 py-2.5 rounded text-xs text-canvas focus:border-bronze focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-canvas/70 mb-2">
              Studio Primary Locations *
            </label>
            <input
              type="text"
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-white/5 border border-white/15 px-4 py-2.5 rounded text-xs text-canvas focus:border-bronze focus:outline-none"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center space-x-2 px-8 py-3 bg-bronze text-white text-xs font-medium tracking-ultra uppercase hover:bg-bronze-light transition-colors"
        >
          <Check className="w-4 h-4" />
          <span>{isPending ? "SAVING CONFIGURATION..." : "SAVE STUDIO SETTINGS"}</span>
        </button>
      </div>
    </form>
  );
}
