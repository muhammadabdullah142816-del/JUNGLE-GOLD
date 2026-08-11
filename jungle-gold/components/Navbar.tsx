"use client";
import { useState } from "react";
import Link from "next/link";
import { ShoppingCart, Menu, X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import CartDrawer from "./CartDrawer";

export default function Navbar() {
  const { count, drawerOpen, openDrawer, closeDrawer } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { href: "#products", label: "Products" },
    { href: "#story", label: "Our Story" },
    { href: "#reviews", label: "Reviews" },
    { href: "/team", label: "Our Team" },
    { href: "#contact", label: "Contact" },
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 glass-card-dark border-b border-gold/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/brand-logo.png"
              alt="Jungle Gold Raw Wild Forest Honey Logo"
              className="h-10 w-10 md:h-14 md:w-14 rounded-full object-contain transition-all duration-300 hover:drop-shadow-[0_0_10px_rgba(212,175,55,0.6)]"
            />
            <div className="leading-tight">
              <div className="font-serif text-xl font-bold text-gold tracking-wide">Jungle Gold</div>
              <div className="text-cream/50 text-[10px] tracking-[0.2em] uppercase">Raw Wild Forest Honey</div>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-cream/70 hover:text-gold text-sm font-medium transition-colors duration-200"
              >
                {l.label}
              </a>
            ))}
          </div>

          {/* Cart + Mobile menu */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => openDrawer()}
              className="relative min-w-[48px] min-h-[48px] flex items-center justify-center p-2 text-cream/80 hover:text-gold transition-colors rounded-lg"
              aria-label="Open cart"
            >
              <ShoppingCart size={22} />
              {count > 0 && (
                <span className="absolute top-1 right-1 bg-gold text-forest text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-gold-glow">
                  {count}
                </span>
              )}
            </button>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden min-w-[48px] min-h-[48px] flex items-center justify-center p-2 text-cream/80 hover:text-gold transition-colors rounded-lg"
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {menuOpen && (
          <div className="md:hidden border-t border-gold/10 bg-forest/95 px-4 py-4 flex flex-col gap-4">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                className="text-cream/80 hover:text-gold text-sm font-medium transition-colors"
              >
                {l.label}
              </a>
            ))}
          </div>
        )}
      </nav>

      <CartDrawer open={drawerOpen} onClose={closeDrawer} />
    </>
  );
}
