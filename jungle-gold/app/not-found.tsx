import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-forest flex flex-col items-center justify-center text-center p-6 font-sans">
      <div className="glass-card max-w-md p-8 rounded-2xl border border-gold/20 shadow-2xl">
        <span className="text-gold font-serif text-6xl font-bold block mb-2">404</span>
        <h2 className="font-serif text-2xl font-bold text-cream mb-3">Page Not Found</h2>
        <p className="text-cream/70 text-sm mb-6 leading-relaxed">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-block bg-gold text-forest font-bold px-6 py-3 rounded-lg hover:bg-gold-light transition-all shadow-gold-glow"
        >
          Return to Homepage
        </Link>
      </div>
    </div>
  );
}
