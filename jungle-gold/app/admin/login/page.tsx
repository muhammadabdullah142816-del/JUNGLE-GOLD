"use client";
import { useState } from "react";
import { login } from "./actions";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const formData = new FormData(e.currentTarget);
    const result = await login(formData);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center hex-pattern px-4">
      <motion.form 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit} 
        className="glass-card-dark rounded-2xl p-10 w-full max-w-sm border border-gold/20 flex flex-col gap-5 relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 right-0 h-1 bg-gold-gradient" />
        
        <div className="text-center">
          <img src="/brand-logo.png" alt="Jungle Gold" className="w-16 h-16 rounded-full mx-auto mb-4 border-2 border-gold/40 object-contain shadow-gold-glow" />
          <h1 className="font-serif text-2xl font-bold text-cream">Admin Access</h1>
          <p className="text-cream/40 text-sm mt-1">Jungle Gold Dashboard</p>
        </div>
        
        <div className="space-y-1">
          <input
            type="password"
            name="password"
            placeholder="Enter Admin Password"
            required
            disabled={loading}
            className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-cream placeholder:text-cream/30 text-sm focus:outline-none transition-colors ${
              error ? "border-red-500/60" : "border-gold/20 focus:border-gold/60"
            }`}
          />
          {error && <p className="text-red-400 text-xs mt-1 text-center">{error}</p>}
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="bg-gold-gradient flex items-center justify-center gap-2 text-forest font-bold py-3 rounded-xl hover:shadow-gold-glow transition-all disabled:opacity-70 disabled:hover:shadow-none"
        >
          {loading ? <Loader2 size={18} className="animate-spin" /> : "Enter Dashboard"}
        </button>
      </motion.form>
    </div>
  );
}
