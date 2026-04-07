import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { Features } from "@/components/features";
import { ComplianceOS } from "@/components/compliance-os";
import { CTA } from "@/components/cta";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-950">
      <Header />
      <Hero />
      <Features />
      <ComplianceOS />
      <CTA />
      <Footer />
    </main>
  );
}
