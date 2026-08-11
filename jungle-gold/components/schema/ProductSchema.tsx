import React from "react";
import type { Product } from "@/types/database";

export default function ProductSchema({ products }: { products: Product[] }) {
  if (!products || products.length === 0) return null;

  const schema = products.map((product) => {
    const minPrice = product.variants?.length
      ? Math.min(...product.variants.map((v) => v.price))
      : 1200;
    const maxPrice = product.variants?.length
      ? Math.max(...product.variants.map((v) => v.price))
      : 4500;

    return {
      "@context": "https://schema.org",
      "@type": "Product",
      "@id": `https://junglegold.pk/#product-${product.id}`,
      "name": product.title,
      "image": product.images?.length > 0 ? product.images : ["https://junglegold.pk/products.jpg"],
      "description": product.description || "100% pure raw wild forest honey, unheated, unfiltered and unprocessed.",
      "brand": {
        "@type": "Brand",
        "name": "Jungle Gold"
      },
      "offers": {
        "@type": "AggregateOffer",
        "priceCurrency": "PKR",
        "lowPrice": minPrice,
        "highPrice": maxPrice,
        "offerCount": product.variants?.length || 1,
        "offers": product.variants?.map((v) => ({
          "@type": "Offer",
          "name": `${product.title} - ${v.size}`,
          "price": v.price,
          "priceCurrency": "PKR",
          "availability": v.in_stock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
          "url": "https://junglegold.pk/#products"
        }))
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "reviewCount": "128"
      }
    };
  });

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
