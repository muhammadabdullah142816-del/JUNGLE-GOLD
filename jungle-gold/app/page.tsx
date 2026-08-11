import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ProductGrid from "@/components/ProductGrid";
import AuthenticityBlock from "@/components/AuthenticityBlock";
import SocialProof from "@/components/SocialProof";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="pt-16">
        <HeroSection />
        <div className="gold-divider" />
        <ProductGrid />
        <div className="gold-divider" />
        <AuthenticityBlock />
        <div className="gold-divider" />
        <SocialProof />
      </main>
      <Footer />
    </>
  );
}
