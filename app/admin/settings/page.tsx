import React from "react";
import { getSiteSettings } from "@/lib/db/queries";
import { SettingsForm } from "@/components/admin/SettingsForm";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <div className="space-y-8">
      <div className="border-b border-white/10 pb-6">
        <span className="text-[11px] tracking-ultra text-bronze uppercase">
          GLOBAL CONFIGURATION
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-light text-canvas">
          Studio Information
        </h1>
        <p className="text-xs text-canvas/60 mt-1">
          Configure public artist bio, direct contact details, international studio locations, and header tagline.
        </p>
      </div>

      <SettingsForm settings={settings} />
    </div>
  );
}
