"use client";

import React, { useState, useTransition, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Lock, Mail, Eye, EyeOff, Camera, ArrowRight, AlertCircle, ArrowLeft, ShieldCheck } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fromUrl = searchParams.get("from") || "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    startTransition(async () => {
      try {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        const data = await res.json();

        if (res.ok && data.success) {
          router.push(fromUrl);
          router.refresh();
        } else {
          setErrorMsg(data.error || "Authentication failed. Invalid email or password.");
        }
      } catch (err: unknown) {
        setErrorMsg(err instanceof Error ? err.message : "Network error during login");
      }
    });
  };

  return (
    <div className="relative z-10 max-w-md w-full mx-auto my-12 bg-white/[0.03] border border-white/10 p-8 sm:p-10 rounded-sm shadow-2xl backdrop-blur-md">
      <div className="flex flex-col items-center text-center space-y-3 mb-8">
        <div className="w-12 h-12 rounded-full bg-bronze/10 border border-bronze/30 flex items-center justify-center text-bronze mb-2">
          <Camera className="w-5 h-5" />
        </div>
        <h1 className="font-serif text-3xl font-light tracking-wide text-canvas">
          Studio Portal
        </h1>
        <p className="text-xs text-canvas/50 tracking-widest uppercase flex items-center space-x-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-bronze" />
          <span>JWT SECURED CMS ACCESS</span>
        </p>
      </div>

      {errorMsg && (
        <div className="mb-6 bg-rose-500/10 border border-rose-500/20 p-3.5 rounded flex items-center space-x-2.5 text-xs text-rose-300">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-[11px] font-sans tracking-ultra uppercase text-canvas/70 mb-2">
            STUDIO EMAIL
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-canvas/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              required
              placeholder="gaurav@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white/5 border border-white/15 px-4 py-3 pl-10 rounded text-xs text-canvas placeholder:text-canvas/30 focus:border-bronze focus:outline-none transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-sans tracking-ultra uppercase text-canvas/70 mb-2">
            SECURITY KEY / PASSWORD
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-canvas/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type={showPassword ? "text" : "password"}
              required
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/5 border border-white/15 px-4 py-3 pl-10 pr-10 rounded text-xs text-canvas placeholder:text-canvas/30 focus:border-bronze focus:outline-none transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-canvas/40 hover:text-canvas focus:outline-none"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full group inline-flex items-center justify-center space-x-2 py-3.5 bg-bronze text-white text-xs font-medium tracking-ultra uppercase hover:bg-bronze-light transition-all duration-300 disabled:opacity-50"
        >
          <span>{isPending ? "VERIFYING CREDENTIALS..." : "ACCESS STUDIO CMS"}</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </button>
      </form>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-[#0D0D0D] text-[#F4F1EB] flex flex-col justify-between p-6 sm:p-12 relative overflow-hidden">
      {/* Background Ambience / Subtle Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none opacity-40" />

      {/* Top Header */}
      <div className="relative z-10 flex items-center justify-between">
        <Link
          href="/"
          className="group inline-flex items-center space-x-2 text-xs tracking-ultra uppercase text-canvas/60 hover:text-bronze transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
          <span>RETURN TO PUBLIC PORTFOLIO</span>
        </Link>
        <span className="text-[10px] font-mono tracking-widest text-bronze uppercase bg-bronze/10 px-3 py-1 rounded border border-bronze/20">
          STUDIO CMS API AUTH
        </span>
      </div>

      <Suspense fallback={<div className="text-center py-20 text-xs tracking-widest uppercase text-canvas/50">Loading Portal...</div>}>
        <LoginForm />
      </Suspense>

      {/* Bottom Footer Note */}
      <div className="relative z-10 text-center text-[10px] tracking-widest text-canvas/30 uppercase">
        © {new Date().getFullYear()} GAURAV DAMAHE STUDIO • ALL RIGHTS RESERVED
      </div>
    </div>
  );
}
