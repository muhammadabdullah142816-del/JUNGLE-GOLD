"use client";

import { ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function StickyMobileBar() {
  const { count, openDrawer } = useCart();

  const handleOrderClick = () => {
    // If cart has items, open cart drawer directly; otherwise scroll to products section
    if (count > 0) {
      openDrawer();
    } else {
      const productsElem = document.getElementById("products");
      if (productsElem) {
        productsElem.scrollIntoView({ behavior: "smooth" });
      } else {
        openDrawer();
      }
    }
  };

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 glass-card-dark border-t border-gold/30 p-3 shadow-2xl backdrop-blur-md">
      <div className="flex items-center justify-between gap-3 max-w-md mx-auto">
        <div className="flex flex-col">
          <span className="text-gold font-serif text-sm font-bold">Jungle Gold Honey</span>
          <span className="text-cream/60 text-[11px] flex items-center gap-1">
            <span>🚚</span> Free COD Nationwide
          </span>
        </div>

        <button
          onClick={handleOrderClick}
          className="flex-1 min-h-[48px] bg-gold-gradient text-forest font-bold px-4 py-2.5 rounded-xl shadow-gold-glow flex items-center justify-center gap-2 text-sm hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <ShoppingBag size={18} />
          <span>{count > 0 ? `View Cart (${count})` : "Order Now (COD)"}</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}
