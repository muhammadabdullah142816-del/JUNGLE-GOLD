import React from "react";

export default function FAQSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Where to buy 100% pure raw Sidr honey in Pakistan?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "You can order 100% pure, lab-tested, raw Sidr honey directly from Jungle Gold (junglegold.pk). We harvest unpasteurized honey from wild forest hives in Swat, Skardu, and Margalla, delivering nationwide across Pakistan with Cash on Delivery."
        }
      },
      {
        "@type": "Question",
        "name": "How to test if raw honey is 100% pure?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Pure raw honey has low water content, does not dissolve instantly in water, creates a natural memory pattern when swirled in cold water, and crystallizes naturally over time. Jungle Gold provides laboratory test reports verifying zero sugar syrup dilution and zero heat treatment."
        }
      },
      {
        "@type": "Question",
        "name": "What is the difference between raw honey and commercial processed honey?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Commercial honey is ultra-filtered and pasteurized at high heat, destroying active enzymes, pollen, and natural antioxidants. Raw honey from Jungle Gold is bottled straight from the hive without heating, preserving natural bee pollen, propolis, live enzymes, and medicinal benefits."
        }
      },
      {
        "@type": "Question",
        "name": "Does Jungle Gold deliver raw honey to Karachi, Lahore, and Islamabad?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, Jungle Gold delivers nationwide across Pakistan including Karachi, Lahore, Islamabad, Rawalpindi, Peshawar, Faisalabad, and Gujrat within 2-4 business days via Cash on Delivery."
        }
      }
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
