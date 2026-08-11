"use client";
import { motion } from "framer-motion";
import { Star, BadgeCheck, FlaskConical, Award } from "lucide-react";

const REVIEWS = [
  {
    name: "Asad Mehmood",
    city: "Lahore",
    stars: 5,
    text: "The Skardu Sidr is unlike anything I've tasted. Dense, dark, and incredibly aromatic. Worth every rupee.",
  },
  {
    name: "Fatima Zahra",
    city: "Karachi",
    stars: 5,
    text: "Ordered for my parents. My mother said it reminded her of honey from her village 40 years ago. That's the highest compliment.",
  },
  {
    name: "Dr. Bilal Khan",
    city: "Islamabad",
    stars: 5,
    text: "As someone who tests food quality, I can confirm the purity is real. Crystallized perfectly after two weeks — textbook raw honey.",
  },
];

const TRUST_BADGES = [
  { icon: <BadgeCheck size={24} />, label: "Lab Verified Pure" },
  { icon: <FlaskConical size={24} />, label: "Zero Additives" },
  { icon: <Award size={24} />, label: "Direct from Source" },
];

const IG_POSTS = [
  "/hero-jar.jpg",
  "/products.jpg",
  "/harvest.jpg",
  "/crystallization.jpg",
  "/products.jpg",
  "/hero-jar.jpg",
];

export default function SocialProof() {
  return (
    <section id="reviews" className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-wrap justify-center gap-6 mb-20"
        >
          {TRUST_BADGES.map((b) => (
            <div
              key={b.label}
              className="flex items-center gap-3 glass-card px-6 py-4 rounded-full border border-gold/20 text-gold"
            >
              {b.icon}
              <span className="text-cream text-sm font-medium">{b.label}</span>
            </div>
          ))}
        </motion.div>

        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="text-gold text-sm uppercase tracking-[0.3em] mb-4">Real Customers. Real Results.</p>
          <h2 className="font-serif text-4xl sm:text-5xl font-bold text-cream mb-4">What They&apos;re Saying</h2>
          <div className="gold-divider max-w-xs mx-auto" />
        </motion.div>

        {/* Reviews */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {REVIEWS.map((r, i) => (
            <motion.div
              key={r.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.12 }}
              className="glass-card rounded-2xl p-6 border border-gold/10 hover:border-gold/30 transition-colors"
            >
              <div className="flex gap-1 mb-4">
                {Array.from({ length: r.stars }).map((_, j) => (
                  <Star key={j} size={16} className="fill-gold text-gold" />
                ))}
              </div>
              <p className="italic text-cream/70 text-sm md:text-base leading-relaxed">&ldquo;{r.text.replace(/'/g, "&apos;")}&rdquo;</p>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center text-gold font-bold text-sm">
                  {r.name[0]}
                </div>
                <div>
                  <p className="text-cream text-sm font-semibold">{r.name}</p>
                  <p className="text-cream/40 text-xs">{r.city}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Instagram grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <a
            href="https://instagram.com/junglegoldofficials"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-gold hover:text-honey transition-colors font-medium"
          >
            <span className="text-xl">📸</span>
            @junglegoldofficials
          </a>
          <p className="text-cream/70 max-w-2xl mx-auto md:text-lg">&ldquo;When you buy from Jungle Gold, you aren&apos;t just buying honey. You&apos;re preserving the ancient craft of our local honey hunters and supporting a community that has lived in harmony with the forest for generations.&rdquo;</p>
        </motion.div>

        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {IG_POSTS.map((src, i) => (
            <motion.a
              key={i}
              href="https://instagram.com/junglegoldofficials"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
              className="relative aspect-square overflow-hidden rounded-lg group cursor-pointer"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="Jungle Gold Instagram post" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gold/0 group-hover:bg-gold/20 transition-colors duration-300" />
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
