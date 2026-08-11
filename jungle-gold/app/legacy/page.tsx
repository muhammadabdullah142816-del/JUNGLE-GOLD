"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { fetchLegacyMilestones } from "@/lib/api";
import type { LegacyMilestone } from "@/types/database";

export default function LegacyPage() {
  const [milestones, setMilestones] = useState<LegacyMilestone[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLegacyMilestones()
      .then(setMilestones)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Navbar />
      <main className="pt-16 min-h-screen bg-forest">

        {/* Hero */}
        <section className="relative py-24 px-4 text-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-forest/90 z-0" />
          <div className="relative z-10 max-w-3xl mx-auto">
            <p className="text-gold text-sm uppercase tracking-[0.3em] mb-4">Est. 2018</p>
            <h1 className="font-serif text-5xl sm:text-6xl font-bold text-cream mb-6 leading-tight">
              Our Legacy
            </h1>
            <p className="text-cream/70 text-lg leading-relaxed max-w-2xl mx-auto">
              From the wild forests of Swat and Skardu to homes across Pakistan — a journey built on purity, trust, and nature.
            </p>
          </div>
        </section>

        {/* Timeline */}
        <section className="py-20 px-4 max-w-5xl mx-auto">
          {loading ? (
            <div className="flex flex-col gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-48 rounded-2xl bg-white/5 animate-pulse" />
              ))}
            </div>
          ) : milestones.length === 0 ? (
            <div className="text-center py-20 text-cream/40">
              <p className="text-xl">No legacy milestones added yet.</p>
              <p className="text-sm mt-2">Check back soon — our story is being written.</p>
            </div>
          ) : (
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-gold/20 hidden md:block" />

              <div className="flex flex-col gap-16">
                {milestones.map((milestone, i) => {
                  const isLeft = i % 2 === 0;
                  return (
                    <div
                      key={milestone.id}
                      className={`flex flex-col md:flex-row items-center gap-8 ${isLeft ? "md:flex-row" : "md:flex-row-reverse"}`}
                    >
                      {/* Content */}
                      <div className="flex-1 glass-card p-8 rounded-2xl border border-gold/20 shadow-lg">
                        <span className="inline-block bg-gold/20 text-gold text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
                          {milestone.year_or_date}
                        </span>
                        <h2 className="font-serif text-2xl font-bold text-cream mb-3">{milestone.title}</h2>
                        <p className="text-cream/70 leading-relaxed">{milestone.description}</p>
                      </div>

                      {/* Center dot */}
                      <div className="hidden md:flex flex-shrink-0 w-10 h-10 rounded-full bg-gold border-4 border-forest items-center justify-center z-10 shadow-gold-glow">
                        <div className="w-3 h-3 rounded-full bg-forest" />
                      </div>

                      {/* Image */}
                      <div className="flex-1">
                        {milestone.image_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={milestone.image_url}
                            alt={`Jungle Gold Legacy Milestone - ${milestone.title}`}
                            loading="lazy"
                            className="w-full h-64 object-cover rounded-2xl border border-gold/20 shadow-lg"
                          />
                        ) : (
                          <div className="w-full h-64 rounded-2xl bg-white/5 border border-gold/10 flex items-center justify-center">
                            <span className="text-cream/20 text-sm">No image</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
