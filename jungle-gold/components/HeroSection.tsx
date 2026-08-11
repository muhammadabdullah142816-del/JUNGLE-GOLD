"use client";
import { motion } from "framer-motion";
import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden hex-pattern">
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src="/hero-jar.jpg"
          alt="Jungle Gold wild honey jar in forest"
          fill
          className="object-cover opacity-35"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-forest/60 via-forest/40 to-forest" />
      </div>

      {/* Floating hex decorations */}
      <div className="absolute top-1/4 left-8 w-24 h-24 rounded-full border border-gold/20 animate-float opacity-30 hidden lg:block" />
      <div className="absolute bottom-1/3 right-12 w-16 h-16 rounded-full border border-gold/15 animate-float opacity-20 hidden lg:block" style={{ animationDelay: "2s" }} />

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 glass-card px-4 py-2 rounded-full text-sm text-gold mb-8 border border-gold/30"
        >
          <span className="w-2 h-2 bg-gold rounded-full animate-pulse" />
          Fresh Harvest — Limited Stock Available
        </motion.div>

        {/* Main heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="font-serif text-5xl sm:text-6xl lg:text-8xl font-bold leading-[1.05] mb-6"
        >
          <span className="gold-shimmer">100% Raw &</span>
          <br />
          <span className="text-cream">Untreated</span>
          <br />
          <span className="text-gold/90">Wild Forest</span>
          <br />
          <span className="text-cream/90">Honey</span>
        </motion.h1>

        {/* Urdu tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.35 }}
          className="urdu-text text-gold/80 mb-4"
        >
          خالص شہد — براہ راست جنگل سے
        </motion.p>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45 }}
          className="text-cream/60 text-lg mb-10 max-w-xl mx-auto leading-relaxed"
        >
          Cold-extracted from the ancient forests of Swat, Skardu & Changa Manga.
          Zero heat. Zero additives. Just pure, wild honey the way nature intended.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <a
            href="#products"
            className="group relative inline-flex items-center gap-2 bg-gold-gradient text-forest font-bold px-8 py-4 rounded-full text-lg hover:shadow-gold-glow-lg transition-all duration-300 hover:scale-105"
          >
            🍯 Order Fresh Harvest
          </a>
          <a
            href="#story"
            className="inline-flex items-center gap-2 glass-card border border-gold/30 text-cream/80 hover:text-gold hover:border-gold/60 font-medium px-6 py-4 rounded-full text-sm transition-all duration-300"
          >
            Our Story →
          </a>
        </motion.div>

        {/* Trust stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.9 }}
          className="mt-16 flex flex-wrap justify-center gap-8 text-center"
        >
          {[
            { val: "3", label: "Forest Origins" },
            { val: "100%", label: "Raw & Unfiltered" },
            { val: "Rs.50K", label: "Purity Guarantee" },
            { val: "0", label: "Additives" },
          ].map((s) => (
            <div key={s.label} className="flex flex-col gap-1">
              <span className="font-serif text-3xl font-bold text-gold">{s.val}</span>
              <span className="text-cream/50 text-xs uppercase tracking-wider">{s.label}</span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-forest to-transparent" />
    </section>
  );
}
