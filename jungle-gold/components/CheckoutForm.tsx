"use client";
import { useState, FormEvent } from "react";
import { MessageCircle, Loader2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { createOrder } from "@/lib/api";

export default function CheckoutForm({ onSuccess }: { onSuccess: () => void }) {
  const { items, total, clear } = useCart();
  const [loading, setLoading] = useState(false);
  const [fields, setFields] = useState({
    customer_name: "",
    phone: "",
    city: "",
    address: "",
  });

  function set(key: string, val: string) {
    setFields((f) => ({ ...f, [key]: val }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    
    // Manual Validation
    if (!fields.customer_name.trim() || !fields.city.trim() || !fields.address.trim()) {
      return alert("Please fill in all required fields.");
    }
    const phoneRegex = /^(03\d{9}|\+923\d{9})$/;
    if (!phoneRegex.test(fields.phone.replace(/\s/g, ""))) {
      return alert("Please enter a valid Pakistani phone number (e.g. 03001234567).");
    }

    setLoading(true);

    try {
      await createOrder({
        customer_name: fields.customer_name,
        phone: fields.phone,
        city: fields.city,
        address: fields.address,
        items,
        total_amount: total,
      });
    } catch (err: unknown) {
      if (err instanceof Error) console.error(err);
      // non-fatal
    }

    // 2. Build WhatsApp message
    const lineItems = items
      .map((i) => `• ${i.title} (${i.size}) x${i.quantity} — Rs. ${(i.price * i.quantity).toLocaleString()}`)
      .join("\n");

    const msg = encodeURIComponent(
      `🍯 *New Order — Jungle Gold*\n` +
      `Customer: ${fields.customer_name}\n` +
      `Phone: ${fields.phone}\n` +
      `City: ${fields.city}\n` +
      `Address: ${fields.address}\n\n` +
      `*Items:*\n${lineItems}\n\n` +
      `*Total: Rs. ${total.toLocaleString()}*\n` +
      `Payment: Cash on Delivery`
    );

    const wa = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "923240917740";
    window.open(`https://wa.me/${wa}?text=${msg}`, "_blank");

    clear();
    setLoading(false);
    onSuccess();
  }

  const inputCls =
    "w-full bg-white/5 border border-gold/20 rounded-xl px-4 py-3 text-cream placeholder:text-cream/30 text-sm focus:outline-none focus:border-gold/60 transition-colors";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <h3 className="font-serif text-lg font-bold text-cream">Delivery Details</h3>
      <input required placeholder="Full Name" value={fields.customer_name} onChange={(e) => set("customer_name", e.target.value)} className={inputCls} />
      <input required type="tel" placeholder="Phone Number" value={fields.phone} onChange={(e) => set("phone", e.target.value)} className={inputCls} />
      <input required placeholder="City" value={fields.city} onChange={(e) => set("city", e.target.value)} className={inputCls} />
      <textarea required rows={3} placeholder="Full Delivery Address" value={fields.address} onChange={(e) => set("address", e.target.value)} className={inputCls + " resize-none"} />

      <div className="p-4 glass-card rounded-xl border border-gold/10">
        <p className="text-cream/60 text-xs mb-1">Order Total</p>
        <p className="font-serif text-2xl font-bold text-gold">Rs. {total.toLocaleString()}</p>
        <p className="text-cream/40 text-xs mt-1">Cash on Delivery</p>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-500 text-white font-bold py-4 rounded-xl transition-all hover:scale-[1.02] disabled:opacity-60"
      >
        {loading ? (
          <Loader2 size={18} className="animate-spin" />
        ) : (
          <MessageCircle size={18} />
        )}
        Confirm via WhatsApp
      </button>

      <p className="text-cream/30 text-xs text-center">
        This opens WhatsApp to confirm your order. Payment collected on delivery.
      </p>
    </form>
  );
}
