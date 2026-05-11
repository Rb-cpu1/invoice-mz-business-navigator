import { Check } from "lucide-react";

const plans = [
  {
    name: "Inicial",
    price: "0",
    desc: "Para começar a profissionalizar.",
    features: ["Até 10 facturas/mês", "1 utilizador", "Cotações em PDF", "Suporte por email"],
  },
  {
    name: "Profissional",
    price: "1.490",
    desc: "Para PMEs em crescimento.",
    features: ["Facturação ilimitada", "Até 5 utilizadores", "Gestão de stock completa", "WhatsApp & email", "Relatórios PDF/Excel"],
    highlight: true,
  },
  {
    name: "Empresarial",
    price: "3.990",
    desc: "Para grupos e múltiplas empresas.",
    features: ["Multi-empresa ilimitada", "Utilizadores ilimitados", "Permissões avançadas", "Backup automático", "Suporte prioritário 24/7"],
  },
];

export function Pricing() {
  return (
    <section id="precos" className="py-24 px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <p className="text-xs font-bold uppercase tracking-widest text-brand mb-4">Preços</p>
        <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
          Planos para cada fase do seu negócio
        </h2>
        <p className="text-muted-foreground text-lg">
          Comece grátis. Atualize quando precisar de mais.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((p) => (
          <div
            key={p.name}
            className={`relative p-8 rounded-3xl border transition-all ${
              p.highlight
                ? "bg-brand-dark text-white border-brand-dark shadow-elegant scale-[1.02]"
                : "bg-card border-border hover:border-brand/40"
            }`}
          >
            {p.highlight && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-brand text-brand-foreground text-[10px] font-bold uppercase tracking-widest rounded-full">
                Mais Popular
              </div>
            )}
            <h3 className="font-display font-bold text-xl mb-2">{p.name}</h3>
            <p className={`text-sm mb-6 ${p.highlight ? "text-white/60" : "text-muted-foreground"}`}>
              {p.desc}
            </p>
            <div className="mb-6">
              <span className="font-display text-5xl font-bold">{p.price}</span>
              <span className={`ml-1 text-sm ${p.highlight ? "text-white/60" : "text-muted-foreground"}`}>
                MT/mês
              </span>
            </div>
            <button
              className={`w-full py-3 rounded-xl font-semibold text-sm mb-8 transition-all ${
                p.highlight
                  ? "bg-brand text-brand-foreground hover:opacity-90"
                  : "bg-foreground text-background hover:opacity-90"
              }`}
            >
              Começar agora
            </button>
            <ul className="space-y-3">
              {p.features.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm">
                  <Check className={`size-4 mt-0.5 shrink-0 ${p.highlight ? "text-brand" : "text-brand"}`} />
                  <span className={p.highlight ? "text-white/80" : "text-foreground/80"}>{f}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
