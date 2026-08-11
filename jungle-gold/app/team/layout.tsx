import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Team & Master Beekeepers — Jungle Gold Pure Raw Honey",
  description:
    "Meet the passionate beekeepers, harvesters, and quality assurance team behind Jungle Gold Pure Raw Honey in Pakistan.",
  alternates: {
    canonical: "https://junglegold.pk/team",
  },
  openGraph: {
    title: "Our Team & Master Beekeepers — Jungle Gold Pure Raw Honey",
    description: "Meet the passionate beekeepers, harvesters, and quality assurance team behind Jungle Gold.",
    url: "https://junglegold.pk/team",
  },
};

export default function TeamLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
