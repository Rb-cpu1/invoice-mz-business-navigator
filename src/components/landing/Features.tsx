import { FileText, Package, Users, BarChart3, Wallet, Building2 } from "lucide-react";

const features = [
  {
    icon: FileText,
    title: "Cotações & Facturação",
    desc: "Crie cotações profissionais, converta em facturas com um clique e envie por WhatsApp ou email.",
    accent: "brand",
  },
  {
    icon: Package,
    title: "Gestão de Stock",
    desc: "Controle entradas e saídas, alertas automáticos de stock baixo e previsão inteligente de reposição.",
    accent: "amber",
  },
  {
    icon: BarChart3,
    title: "Dashboard Inteligente",
    desc: "Acompanhe vendas, lucros, clientes frequentes e crescimento mensal com gráficos animados em tempo real.",
    accent: "indigo",
  },
  {
    icon: Wallet,
    title: "Gestão Financeira",
    desc: "Fluxo de caixa, categorias, metas, lucro líquido e relatórios exportáveis em PDF e Excel.",
    accent: "brand",
  },
  {
    icon: Users,
    title: "Gestão de Clientes",
    desc: "Cadastro, histórico de compras, dívidas pendentes e contacto rápido via WhatsApp.",
    accent: "amber",
  },
  {
    icon: Building2,
    title: "Multi-Empresa",
    desc: "Gira várias empresas e funcionários com diferentes níveis de permissão numa só conta.",
    accent: "indigo",
  },
];

const accentMap: Record<string, string> = {
  brand: "bg-brand/10 text-brand group-hover:bg-brand group-hover:text-brand-foreground",
  amber: "bg-amber-500/10 text-amber-600 group-hover:bg-amber-500 group-hover:text-white",
  indigo: "bg-indigo-500/10 text-indigo-600 group-hover:bg-indigo-500 group-hover:text-white",
};

export function Features() {
  return (
    <section id="funcionalidades" className="bg-surface-soft py-24 px-6 lg:px-8 border-y border-border">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-xs font-bold uppercase tracking-widest text-brand mb-4">Funcionalidades</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Ferramentas de classe mundial
          </h2>
          <p className="text-muted-foreground text-lg">
            Adaptadas à realidade do empresário moçambicano.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              className="group bg-card p-8 rounded-2xl border border-border hover:shadow-card hover:-translate-y-1 transition-all"
            >
              <div className={`size-12 rounded-xl mb-6 grid place-items-center transition-colors ${accentMap[f.accent]}`}>
                <f.icon className="size-6" />
              </div>
              <h3 className="text-xl font-bold font-display mb-3">{f.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
