import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { MobileTeaser } from "@/components/landing/MobileTeaser";
import { Pricing } from "@/components/landing/Pricing";
import { CTA } from "@/components/landing/CTA";
import { Footer } from "@/components/landing/Footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "INVOICE MZ — Gestão de Facturação, Stock e Finanças em Moçambique" },
      {
        name: "description",
        content:
          "Software de gestão empresarial para Moçambique: cotações, facturas, stock, clientes e finanças. Adaptado a NUIT, IVA e MZN. Comece grátis.",
      },
      { property: "og:title", content: "INVOICE MZ — SaaS de Gestão Empresarial" },
      {
        property: "og:description",
        content:
          "Cotações, facturação e stock simplificados para PMEs em Moçambique. Envie por WhatsApp, email e gere PDFs profissionais.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <Hero />
      <Features />
      <MobileTeaser />
      <Pricing />
      <CTA />
      <Footer />
    </div>
  );
}
