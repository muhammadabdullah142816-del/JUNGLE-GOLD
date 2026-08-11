import { NextResponse } from "next/server";
import { fetchProducts } from "@/lib/api";
import type { Product } from "@/types/database";

const MOCK_PRODUCTS: Product[] = [
  {
    id: "prod-sidr-01",
    title: "Raw Wild Sidr (Beri) Honey",
    description: "100% pure, unheated, unfiltered raw wild Sidr honey harvested from wild berries in Swat Valley & Karak.",
    images: ["/hero-honey-jar.jpg"],
    variants: [
      { id: "var-100", size: "100ml", price: 1200, in_stock: true },
      { id: "var-200", size: "200ml", price: 2200, in_stock: true },
      { id: "var-720", size: "720ml", price: 4500, in_stock: true },
    ],
    created_at: new Date().toISOString(),
  },
  {
    id: "prod-multi-02",
    title: "Wild Forest Multi-Flower Honey",
    description: "Harvested from untouched high-altitude forest blossoms in Margalla Hills & Skardu. Rich in live bee pollen.",
    images: ["/products.jpg"],
    variants: [
      { id: "var-m100", size: "100ml", price: 1000, in_stock: true },
      { id: "var-m200", size: "200ml", price: 1800, in_stock: true },
      { id: "var-m720", size: "720ml", price: 3800, in_stock: true },
    ],
    created_at: new Date().toISOString(),
  },
];

export async function GET() {
  try {
    const products = await fetchProducts();
    if (!products || products.length === 0) {
      return NextResponse.json({ success: true, products: MOCK_PRODUCTS, source: "mock" });
    }
    return NextResponse.json({ success: true, products, source: "database" });
  } catch (err: unknown) {
    console.error("Products API route error (returning fallback mock data):", err);
    return NextResponse.json({ success: true, products: MOCK_PRODUCTS, source: "fallback" });
  }
}
