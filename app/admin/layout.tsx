import React from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Images,
  PlusCircle,
  FolderTree,
  Settings,
  ExternalLink,
  Camera,
  LogOut,
  UserCheck,
} from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { logoutAction } from "./auth-actions";

export const metadata = {
  title: "Studio CMS — Gaurav D. Photography",
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();

  // If unauthenticated (e.g. on /admin/login), do NOT render the admin navigation or sidebar
  if (!user) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] text-[#F4F1EB]">
        {children}
      </div>
    );
  }

  // Only render the administrative dashboard shell for authenticated users
  return (
    <div className="min-h-screen bg-[#111111] text-[#F4F1EB] flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-[#0D0D0D] border-b md:border-b-0 md:border-r border-white/10 p-6 flex flex-col justify-between shrink-0">
        <div className="space-y-8">
          {/* Admin Header */}
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-full bg-bronze/20 border border-bronze/40 flex items-center justify-center text-bronze">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <Link href="/admin" className="font-serif text-lg tracking-wider text-canvas block">
                GAURAV D.
              </Link>
              <span className="text-[10px] tracking-ultra text-bronze uppercase block">
                STUDIO CMS
              </span>
            </div>
          </div>

          {/* User Badge */}
          <div className="bg-white/[0.02] border border-white/10 p-3 rounded text-[11px] flex items-center space-x-2.5">
            <UserCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <div className="overflow-hidden">
              <p className="text-canvas font-medium truncate">{user.name || "Gaurav D."}</p>
              <p className="text-canvas/50 text-[10px] font-mono truncate">{user.email}</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col space-y-1 text-xs tracking-widest uppercase">
            <Link
              href="/admin"
              className="flex items-center space-x-3 px-3 py-2.5 rounded hover:bg-white/5 hover:text-bronze transition-colors"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>DASHBOARD</span>
            </Link>

            <Link
              href="/admin/photos"
              className="flex items-center space-x-3 px-3 py-2.5 rounded hover:bg-white/5 hover:text-bronze transition-colors"
            >
              <Images className="w-4 h-4" />
              <span>PHOTOGRAPHS</span>
            </Link>

            <Link
              href="/admin/photos/new"
              className="flex items-center space-x-3 px-3 py-2.5 rounded text-bronze hover:bg-bronze/10 transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
              <span>NEW PHOTO</span>
            </Link>

            <Link
              href="/admin/categories"
              className="flex items-center space-x-3 px-3 py-2.5 rounded hover:bg-white/5 hover:text-bronze transition-colors"
            >
              <FolderTree className="w-4 h-4" />
              <span>CATEGORIES</span>
            </Link>

            <Link
              href="/admin/settings"
              className="flex items-center space-x-3 px-3 py-2.5 rounded hover:bg-white/5 hover:text-bronze transition-colors"
            >
              <Settings className="w-4 h-4" />
              <span>SETTINGS</span>
            </Link>
          </nav>
        </div>

        {/* View Live Portfolio Link & Logout */}
        <div className="pt-6 border-t border-white/10 mt-6 space-y-3">
          <Link
            href="/"
            target="_blank"
            className="group flex items-center justify-between px-3 py-2 text-xs tracking-widest uppercase text-canvas/70 hover:text-canvas transition-colors border border-white/10 rounded"
          >
            <span>LIVE PORTFOLIO</span>
            <ExternalLink className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>

          <form action={logoutAction}>
            <button
              type="submit"
              className="w-full flex items-center space-x-2.5 px-3 py-2 text-xs tracking-widest uppercase text-rose-400/80 hover:text-rose-300 hover:bg-rose-500/10 transition-colors rounded"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>SIGN OUT</span>
            </button>
          </form>
        </div>
      </aside>

      {/* Main Admin Workspace */}
      <main className="flex-1 p-6 sm:p-10 lg:p-12 overflow-y-auto max-w-6xl">
        {children}
      </main>
    </div>
  );
}
