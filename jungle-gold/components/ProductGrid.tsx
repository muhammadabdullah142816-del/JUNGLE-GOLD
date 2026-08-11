"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ShoppingCart, CheckCircle, XCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { fetchProducts } from "@/lib/api";
import type { Product } from "@/types/database";

import ProductSchema from "@/components/schema/ProductSchema";

export default function ProductGrid() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedVariant, setSelectedVariant] = useState<Record<string, number>>({});
  const [selectedImage, setSelectedImage] = useState<Record<string, number>>({});
  const [added, setAdded] = useState<string | null>(null);
  const { add, openDrawer } = useCart();

  useEffect(() => {
    async function loadProducts() {
      try {
        const data = await fetchProducts();
        setProducts(data || []);
      } catch (err) {
        console.error("Failed to load products:", err);
      }
    }
    loadProducts();
  }, []);

  // Initialize selected variants and images
  useEffect(() => {
    if (products.length > 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedVariant((prev) => {
        const next = { ...prev };
        products.forEach((p) => { if (next[p.id] === undefined) next[p.id] = 0; });
        return next;
      });
      setSelectedImage((prev) => {
        const next = { ...prev };
        products.forEach((p) => { if (next[p.id] === undefined) next[p.id] = 0; });
        return next;
      });
    }
  }, [products]);

  function handleAdd(productId: string) {
    const product = products.find((p) => p.id === productId)!;
    const variantIdx = selectedVariant[productId] || 0;
    const variant = product.variants[variantIdx];
    if (!variant || !variant.in_stock) return;

    add({
      id: product.id,
      title: product.title,
      size: variant.size,
      price: variant.price,
      quantity: 1,
      image: product.images?.[0] || "/products.jpg",
    });

    setAdded(productId + variant.size);
    openDrawer(); // Automatically open the cart drawer
    setTimeout(() => setAdded(null), 2000);
  }

  function nextImage(productId: string, length: number) {
    setSelectedImage(s => ({ ...s, [productId]: ((s[productId] || 0) + 1) % length }));
  }
  function prevImage(productId: string, length: number) {
    setSelectedImage(s => ({ ...s, [productId]: ((s[productId] || 0) - 1 + length) % length }));
  }

  return (
    <section id="products" className="relative py-24 px-4 sm:px-6 lg:px-8">
      <ProductSchema products={products} />
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-gold text-sm uppercase tracking-[0.3em] mb-4">Fresh Harvest Collection</p>
          <h2 className="font-serif text-4xl sm:text-5xl font-bold text-cream mb-4">Choose Your Honey</h2>
          <div className="gold-divider max-w-xs mx-auto" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {products.map((product, i) => {
            const variantIdx = selectedVariant[product.id] || 0;
            const variant = product.variants?.[variantIdx];
            const justAdded = added === (product.id + (variant?.size || ""));
            const images = product.images?.length > 0 ? product.images : ["/products.jpg"];
            const imgIdx = selectedImage[product.id] || 0;

            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                className="glass-card rounded-2xl overflow-hidden product-card-hover group flex flex-col"
              >
                {/* Image Gallery */}
                <div className="relative h-56 overflow-hidden bg-black/20 group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={images[imgIdx]} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-forest via-transparent to-transparent opacity-80" />
                  
                  {images.length > 1 && (
                    <>
                      <button onClick={() => prevImage(product.id, images.length)} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-gold/80 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-all"><ChevronLeft size={18}/></button>
                      <button onClick={() => nextImage(product.id, images.length)} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-gold/80 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-all"><ChevronRight size={18}/></button>
                      <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
                        {images.map((_, dotIdx) => (
                          <div key={dotIdx} className={`w-1.5 h-1.5 rounded-full transition-all ${dotIdx === imgIdx ? "bg-gold w-3" : "bg-white/40"}`} />
                        ))}
                      </div>
                    </>
                  )}
                  
                  {variant && (
                    <div className={`absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold backdrop-blur-md ${variant.in_stock ? "bg-green-900/80 text-green-300 border border-green-500/30" : "bg-red-900/80 text-red-300 border border-red-500/30"}`}>
                      {variant.in_stock ? <CheckCircle size={12} /> : <XCircle size={12} />}
                      {variant.in_stock ? "In Stock" : "Sold Out"}
                    </div>
                  )}
                </div>

                {/* Body */}
                <div className="p-6 flex flex-col flex-1 gap-4">
                  <div>
                    <h3 className="font-serif text-xl font-bold text-cream mb-2">{product.title}</h3>
                    <p className="text-cream/50 text-sm leading-relaxed line-clamp-2">{product.description}</p>
                  </div>

                  {/* Size selector */}
                  {product.variants && product.variants.length > 0 && (
                    <div>
                      <p className="text-cream/40 text-xs uppercase tracking-wider mb-2">Select Size</p>
                      <div className="flex flex-wrap gap-2">
                        {product.variants.map((v, idx) => (
                          <button
                            key={v.id}
                            onClick={() => setSelectedVariant((s) => ({ ...s, [product.id]: idx }))}
                            disabled={!v.in_stock}
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all duration-200
                              ${idx === variantIdx
                                ? "bg-gold text-forest border-gold font-bold shadow-gold-glow"
                                : v.in_stock
                                ? "border-gold/30 text-cream/70 hover:border-gold/60 hover:text-cream"
                                : "border-white/10 text-cream/20 cursor-not-allowed line-through bg-black/20"
                              }`}
                          >
                            {v.size}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Price + CTA */}
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                    <div>
                      <span className="text-gold font-serif text-2xl font-bold">
                        Rs. {variant ? variant.price.toLocaleString() : "---"}
                      </span>
                      <span className="text-cream/30 text-xs ml-1">/ {variant ? variant.size : ""}</span>
                    </div>
                    <button
                      onClick={() => handleAdd(product.id)}
                      disabled={!variant || !variant.in_stock}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-300
                        ${(variant && variant.in_stock)
                          ? justAdded
                            ? "bg-green-600 text-white scale-95"
                            : "bg-gold text-forest hover:shadow-gold-glow hover:scale-105"
                          : "bg-white/5 text-cream/20 cursor-not-allowed"
                        }`}
                    >
                      {justAdded ? <><CheckCircle size={16} /> Added!</> : <><ShoppingCart size={16} /> Add to Cart</>}
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
