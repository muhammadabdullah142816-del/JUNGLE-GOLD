"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { fetchOperators } from "@/lib/api";
import type { Operator } from "@/types/database";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function TeamPage() {
  const [operators, setOperators] = useState<Operator[]>([]);

  useEffect(() => {
    fetchOperators().then(setOperators).catch(() => setOperators([]));
  }, []);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-forest pt-24 pb-20">
        {/* Hero */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-gold text-sm uppercase tracking-[0.3em] mb-4">The People Behind the Honey</p>
            <h1 className="font-serif text-5xl sm:text-6xl font-bold text-cream mb-6">Our Team</h1>
            <div className="gold-divider max-w-xs mx-auto mb-6" />
            <p className="text-cream/60 max-w-2xl mx-auto text-lg leading-relaxed">
              Every jar of Jungle Gold is the result of passionate hands working in harmony with nature.
              Meet the dedicated team that brings pure, raw honey from the wild forests to your table.
            </p>
          </motion.div>
        </section>

        {/* Team Grid */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          {operators.length === 0 ? (
            <p className="text-center text-cream/40 py-20">Our team page is being updated. Check back soon!</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {operators.map((op, i) => (
                <motion.div
                  key={op.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.12 }}
                  className="glass-card rounded-2xl overflow-hidden group"
                >
                  {/* Photo */}
                  <div className="relative h-72 overflow-hidden bg-white/5">
                    {op.image_url ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={op.image_url}
                        alt={op.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="w-24 h-24 rounded-full bg-gold/10 border-2 border-gold/20 flex items-center justify-center text-gold font-serif text-4xl font-bold">
                          {op.name.charAt(0)}
                        </div>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-forest via-transparent to-transparent opacity-80" />
                  </div>

                  {/* Info */}
                  <div className="p-6 text-center -mt-8 relative">
                    <h3 className="font-serif text-xl font-bold text-cream mb-1">{op.name}</h3>
                    <p className="text-gold text-sm font-semibold uppercase tracking-wider mb-3">{op.role}</p>
                    <div className="gold-divider max-w-[60px] mx-auto mb-3" />
                    <p className="text-cream/60 text-sm leading-relaxed">{op.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
