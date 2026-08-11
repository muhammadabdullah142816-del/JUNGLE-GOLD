import { MetadataRoute } from "next";
import { fetchProducts } from "@/lib/api";
import type { Product } from "@/types/database";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://junglegold.pk";

  let products: Product[] = [];
  try {
    products = await fetchProducts();
  } catch (err) {
    console.error("Sitemap fetchProducts error:", err);
  }

  const productUrls: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${baseUrl}/#product-${product.id}`,
    lastModified: new Date(product.created_at || Date.now()),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/legacy`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/team`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    ...productUrls,
  ];
}
