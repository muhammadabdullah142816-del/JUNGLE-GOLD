import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import OrganizationSchema from "@/components/schema/OrganizationSchema";
import FAQSchema from "@/components/schema/FAQSchema";
import StickyMobileBar from "@/components/StickyMobileBar";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://junglegold.pk"),
  title: {
    default: "Jungle Gold — 100% Pure Raw Jungle Honey & Organic Sidr Honey Pakistan | Buy Online PK (Lahore, Karachi, Islamabad)",
    template: "%s | Jungle Gold Pure Raw Honey Pakistan",
  },
  description:
    "Buy 100% pure raw jungle honey, unpasteurized organic honey, and original Sidr Beri honey online in Pakistan (Lahore, Karachi, Islamabad, Rawalpindi, Gujrat). PCSIR lab certified with nationwide Cash on Delivery (COD). Backed by the legacy & trust of Razzaq Pansar Store.",
  keywords: [
    "pure raw jungle honey",
    "unpasteurized organic honey",
    "organic Sidr honey Pakistan",
    "wild Sidr Beri honey Swat",
    "buy raw honey online PK",
    "original sidr honey Lahore",
    "pure raw honey Karachi",
    "natural honey Islamabad",
    "pure honey price in Pakistan",
    "raw honey Gujrat",
    "natural honey delivery Pakistan",
    "Jungle Gold honey",
    "Razzaq Pansar Store raw honey"
  ],
  alternates: {
    canonical: "https://junglegold.pk",
    languages: {
      "en-pk": "https://junglegold.pk",
      "x-default": "https://junglegold.pk",
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "Jungle Gold — 100% Pure Raw Jungle Honey & Organic Sidr Honey Pakistan | Buy Online PK",
    description: "Unfiltered, unpasteurized organic raw wild honey harvested directly from natural hives in Swat & Skardu. Lab certified with Cash on Delivery across Lahore, Karachi, Islamabad. Backed by the trust of Razzaq Pansar Store.",
    url: "https://junglegold.pk",
    siteName: "Jungle Gold Pure Raw Honey Pakistan",
    images: [
      {
        url: "https://junglegold.pk/brand-logo.png",
        width: 1200,
        height: 630,
        alt: "Jungle Gold Pure Raw Jungle Honey Pakistan",
      },
    ],
    locale: "en_PK",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Jungle Gold — 100% Pure Raw Jungle Honey & Organic Sidr Honey Pakistan | Buy Online PK",
    description: "Unfiltered, unpasteurized organic raw wild honey harvested directly from natural hives in Swat & Skardu. Lab certified with Cash on Delivery across Lahore, Karachi, Islamabad. Backed by the trust of Razzaq Pansar Store.",
    images: ["https://junglegold.pk/brand-logo.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-PK" className={`${playfair.variable} ${inter.variable}`}>
      <head>
        <meta name="geo.region" content="PK" />
        <meta name="geo.placename" content="Pakistan" />
        <link rel="alternate" hrefLang="en-pk" href="https://junglegold.pk" />
        <link rel="alternate" hrefLang="x-default" href="https://junglegold.pk" />
        <OrganizationSchema />
        <FAQSchema />
      </head>
      <body className="pb-16 md:pb-0">
        <CartProvider>
          {children}
          <StickyMobileBar />
        </CartProvider>
      </body>
    </html>
  );
}
