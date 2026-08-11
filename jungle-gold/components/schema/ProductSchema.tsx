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
      "description": product.description || "100% pure raw wild forest honey, unheated, unfiltered and unprocessed from Swat & Skardu, Pakistan.",
      "sku": `JG-${product.id.substring(0, 8).toUpperCase()}`,
      "mpn": `JUNGLEGOLD-${product.id.substring(0, 6).toUpperCase()}`,
      "brand": {
        "@type": "Brand",
        "name": "Jungle Gold Raw Honey"
      },
      "category": "Organic Food > Honey & Sweeteners > Raw Honey",
      "certification": [
        {
          "@type": "Certification",
          "name": "100% Unpasteurized & Unheated Lab Certification",
          "issuedBy": "Pakistan Council of Scientific and Industrial Research (PCSIR)"
        }
      ],
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
          "itemCondition": "https://schema.org/NewCondition",
          "availability": v.in_stock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
          "seller": {
            "@type": "Organization",
            "name": "Jungle Gold"
          },
          "url": "https://junglegold.pk/#products"
        }))
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "reviewCount": "148",
        "bestRating": "5",
        "worstRating": "1"
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
