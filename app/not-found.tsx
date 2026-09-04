import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-canvas text-ink flex flex-col items-center justify-center p-6 text-center">
      <span className="text-xs font-sans tracking-ultra text-bronze uppercase mb-4">
        404 — FRAME NOT FOUND
      </span>
      <h1 className="font-serif text-4xl sm:text-6xl font-light mb-4">
        Silence in the Negative Space
      </h1>
      <p className="text-ink-muted text-sm sm:text-base max-w-md mb-8 font-light">
        The requested photograph or story archive does not exist or has been moved to another collection.
      </p>
      <Link
        href="/"
        className="inline-flex items-center space-x-2 px-6 py-3 bg-ink text-canvas text-xs font-medium tracking-ultra uppercase hover:bg-bronze transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>RETURN TO MAIN ARCHIVE</span>
      </Link>
    </div>
  );
}
