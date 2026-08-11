import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Legacy & Journey — Jungle Gold Pure Raw Honey",
  description:
    "Explore the history, wild harvesting origins, and milestones of Jungle Gold Raw Honey from Swat Valley and Skardu to homes across Pakistan.",
  alternates: {
    canonical: "https://junglegold.pk/legacy",
  },
  openGraph: {
    title: "Our Legacy & Journey — Jungle Gold Pure Raw Honey",
    description: "Explore the history, wild harvesting origins, and milestones of Jungle Gold Raw Honey.",
    url: "https://junglegold.pk/legacy",
  },
};

export default function LegacyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
