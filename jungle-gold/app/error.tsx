"use client";
import Link from "next/link";
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global error caught:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-forest flex flex-col items-center justify-center text-center p-6 font-sans">
      <div className="glass-card max-w-md p-8 rounded-2xl border border-gold/20 shadow-2xl">
        <h2 className="font-serif text-3xl font-bold text-gold mb-3">Something went wrong</h2>
        <p className="text-cream/70 text-sm mb-6 leading-relaxed">
          We encountered an unexpected issue while loading this page. Please try again or return home.
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => reset()}
            className="bg-gold text-forest font-bold px-5 py-2.5 rounded-lg hover:bg-gold-light transition-all"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="border border-white/20 text-cream font-medium px-5 py-2.5 rounded-lg hover:bg-white/5 transition-all"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
