import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import OrganizationSchema from "@/components/schema/OrganizationSchema";
import FAQSchema from "@/components/schema/FAQSchema";

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
    default: "Jungle Gold — 100% Pure Raw Wild Forest Honey Pakistan",
    template: "%s | Jungle Gold Raw Honey",
  },
  description:
    "Buy 100% pure, unpasteurized, unheated raw wild forest honey (Sidr, Acacia, Multi-flower) from Swat & Skardu, Pakistan. Lab certified with Cash on Delivery nationwide.",
  keywords: [
    "pure raw honey Pakistan",
    "organic Sidr honey Gujrat",
    "unpasteurized raw honey",
    "wild forest honey Swat",
    "natural honey price Pakistan",
    "Beri honey Pakistan",
    "Jungle Gold honey"
  ],
  alternates: {
    canonical: "https://junglegold.pk",
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
    title: "Jungle Gold — 100% Pure Raw Wild Forest Honey Pakistan",
    description: "Unfiltered, unpasteurized raw wild honey harvested directly from natural hives in Swat & Skardu.",
    url: "https://junglegold.pk",
    siteName: "Jungle Gold Raw Honey",
    images: [
      {
        url: "https://junglegold.pk/brand-logo.png",
        width: 1200,
        height: 630,
        alt: "Jungle Gold Raw Wild Forest Honey",
      },
    ],
    locale: "en_PK",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Jungle Gold — 100% Pure Raw Wild Forest Honey Pakistan",
    description: "Unfiltered, unpasteurized raw wild honey harvested directly from natural hives in Swat & Skardu.",
    images: ["https://junglegold.pk/brand-logo.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <head>
        <OrganizationSchema />
        <FAQSchema />
      </head>
      <body>
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
