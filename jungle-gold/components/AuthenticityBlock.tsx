"use client";
import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, X, Thermometer, Droplets, Shield } from "lucide-react";

const ORIGINS = [
  {
    name: "Swat Valley",
    region: "Khyber Pakhtunkhwa",
    desc: "Ancient mountain forests at 1,000–2,000m elevation. Wild bees collect nectar from untouched wildflower meadows.",
    emoji: "🏔️",
  },
  {
    name: "Skardu",
    region: "Gilgit-Baltistan",
    desc: "High-altitude Sidr trees produce the rarest honey in Pakistan, harvested once a year in autumn.",
    emoji: "⛰️",
  },
  {
    name: "Changa Manga",
    region: "Punjab",
    desc: "Pakistan's largest man-made forest reserve. Diverse flora creates a uniquely floral, light honey.",
    emoji: "🌳",
  },
];

function CrystallizationModal({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="glass-card-dark rounded-2xl p-8 max-w-lg w-full border border-gold/30 relative"
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-cream/40 hover:text-gold transition-colors">
          <X size={20} />
        </button>

        <div className="mb-4">
          <Image
            src="/crystallization.jpg"
            alt="Raw honey crystallizing naturally"
            width={460}
            height={220}
            className="w-full h-44 object-cover rounded-xl mb-5"
          />
        </div>

        <h3 className="font-serif text-2xl font-bold text-cream mb-2">
          Why Does Our Honey Crystallize?
        </h3>
        <p className="text-gold text-sm mb-5 italic">This is a <strong>sign of purity</strong>, not a defect.</p>

        <div className="space-y-4">
          <div className="flex gap-3">
            <div className="p-2 bg-gold/10 rounded-lg flex-shrink-0"><Shield size={18} className="text-gold" /></div>
            <p className="text-cream/70 text-sm leading-relaxed">
              Raw honey contains natural glucose that forms crystals over time. Processed honey is heated to prevent this — which destroys enzymes, antioxidants, and flavour.
            </p>
          </div>
          <div className="flex gap-3">
            <div className="p-2 bg-gold/10 rounded-lg flex-shrink-0"><Thermometer size={18} className="text-gold" /></div>
            <p className="text-cream/70 text-sm leading-relaxed">
              <strong className="text-cream">To reliquefy:</strong> Place the jar in warm water (not hot, max 40°C) for 15–20 minutes. Stir gently. Never microwave — it destroys the goodness.
            </p>
          </div>
          <div className="flex gap-3">
            <div className="p-2 bg-gold/10 rounded-lg flex-shrink-0"><Droplets size={18} className="text-gold" /></div>
            <p className="text-cream/70 text-sm leading-relaxed">
              Crystallized honey is equally nutritious. Many customers prefer it — it spreads like butter and has a deeper, richer flavour.
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function AuthenticityBlock() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <section id="story" className="py-24 px-4 sm:px-6 lg:px-8 hex-pattern relative">
        <div className="max-w-7xl mx-auto">
          {/* Heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <p className="text-gold text-sm uppercase tracking-[0.3em] mb-4">Where the Honey Comes From</p>
            <h2 className="font-serif text-4xl sm:text-5xl font-bold text-cream mb-4">
              Rooted in the Wild
            </h2>
            <div className="gold-divider max-w-xs mx-auto mb-6" />
            <p className="text-cream/50 max-w-xl mx-auto text-sm leading-relaxed">
              Every jar of Jungle Gold is traceable to a specific forest and harvest season.
              No blending. No mixing origins.
            </p>
          </motion.div>

          {/* Two-column: image + origins */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="relative rounded-2xl overflow-hidden h-80 lg:h-96"
            >
              <Image
                src="/harvest.jpg"
                alt="Wild honey harvest in Swat Valley Pakistan"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-forest/80 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 right-5">
                <p className="font-serif text-lg font-bold text-cream">Traditional Wild Harvest</p>
                <p className="text-cream/60 text-sm">Swat Valley, Pakistan</p>
              </div>
            </motion.div>

            <div className="flex flex-col gap-5">
              {ORIGINS.map((o, i) => (
                <motion.div
                  key={o.name}
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.12 }}
                  className="glass-card rounded-xl p-5 flex gap-4 hover:border-gold/40 transition-colors border border-transparent"
                >
                  <span className="text-3xl">{o.emoji}</span>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-serif text-lg font-bold text-cream">{o.name}</h3>
                      <div className="flex items-center gap-1 text-gold/60 text-xs">
                        <MapPin size={10} />
                        {o.region}
                      </div>
                    </div>
                    <p className="text-cream/55 text-sm leading-relaxed">{o.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Purity guarantee banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="honey-drip glass-card-dark rounded-2xl p-8 text-center border border-gold/20 mb-12"
          >
            <p className="font-serif text-3xl sm:text-4xl font-bold text-gold mb-3">
              Rs. 50,000 Purity Guarantee
            </p>
            <p className="text-cream/60 max-w-lg mx-auto text-sm leading-relaxed mb-3">
              We guarantee every jar is 100% pure. If independent lab testing finds any adulteration,
              we will refund your entire order plus pay Rs. 50,000. That is how confident we are.
            </p>
            <p className="text-gold/80 text-xs tracking-wide">
              🌿 Backed by the legacy & trust of Razzaq Pansar Store.
            </p>
          </motion.div>

          {/* Crystallization explainer trigger */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <p className="text-cream/40 text-sm mb-3">Noticed your honey crystallizing?</p>
            <button
              onClick={() => setModalOpen(true)}
              className="inline-flex items-center gap-2 border border-gold/40 text-gold hover:bg-gold/10 px-6 py-3 rounded-full text-sm font-medium transition-all"
            >
              🔬 Learn About Natural Crystallization
            </button>
          </motion.div>
        </div>
      </section>

      <AnimatePresence>
        {modalOpen && <CrystallizationModal onClose={() => setModalOpen(false)} />}
      </AnimatePresence>
    </>
  );
}
