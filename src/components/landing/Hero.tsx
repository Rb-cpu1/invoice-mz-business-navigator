import { Link } from "@tanstack/react-router";

export function Hero() {
  return (
    <section className="px-6 lg:px-8 py-20 lg:py-28 max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
      <div className="animate-fade-up">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand/10 text-brand text-xs font-bold uppercase tracking-wider mb-6">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-brand" />
          </span>
          Líder em Moçambique
        </div>
        <h1 className="font-display text-5xl md:text-6xl font-extrabold leading-[1.05] mb-6">
          Gere o seu negócio de forma{" "}
          <span className="text-brand">inteligente.</span>
        </h1>
        <p className="text-lg text-muted-foreground mb-10 leading-relaxed max-w-md">
          Cotações, Facturação e Stock simplificados para o mercado moçambicano.
          Do NUIT ao IVA, tem tudo sob controlo.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link to="/auth" className="px-8 py-4 bg-brand text-brand-foreground rounded-xl font-bold text-base shadow-elegant hover:scale-[1.02] transition-transform text-center">
            Começar Agora
          </Link>
          <a href="#funcionalidades" className="px-8 py-4 border border-border bg-background rounded-xl font-bold text-base hover:bg-muted transition-colors text-center">
            Ver funcionalidades
          </a>
        </div>
        <div className="mt-10 flex items-center gap-6 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-brand" />
            14 dias grátis
          </div>
          <div className="flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-brand" />
            Sem cartão de crédito
          </div>
          <div className="flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-brand" />
            Suporte em PT
          </div>
        </div>
      </div>

      {/* Dashboard mockup */}
      <div className="relative animate-fade-up">
        <div className="absolute -inset-4 bg-gradient-to-tr from-brand/20 via-transparent to-brand-accent/20 rounded-[2rem] blur-2xl" />
        <div className="relative bg-card rounded-3xl border border-border shadow-card p-6 overflow-hidden">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-display font-bold">Dashboard Geral</h3>
            <div className="flex gap-1.5">
              <div className="size-2.5 rounded-full bg-red-400" />
              <div className="size-2.5 rounded-full bg-amber-400" />
              <div className="size-2.5 rounded-full bg-green-400" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="p-4 bg-surface-soft rounded-2xl border border-border">
              <p className="text-[11px] text-muted-foreground font-medium mb-1">Vendas Mensais</p>
              <p className="text-2xl font-bold font-display">450.000 MT</p>
              <p className="text-[10px] text-brand mt-2 font-semibold">↑ 12% vs mês anterior</p>
            </div>
            <div className="p-4 bg-surface-soft rounded-2xl border border-border">
              <p className="text-[11px] text-muted-foreground font-medium mb-1">Lucro Líquido</p>
              <p className="text-2xl font-bold font-display">128.500 MT</p>
              <p className="text-[10px] text-brand-accent mt-2 font-semibold">Meta: 85% atingida</p>
            </div>
          </div>

          {/* tiny bar chart */}
          <div className="p-4 bg-surface-soft rounded-2xl border border-border mb-4">
            <div className="flex items-end justify-between gap-2 h-20">
              {[40, 65, 50, 80, 45, 90, 70].map((h, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full bg-brand/80 rounded-t-md"
                    style={{ height: `${h}%` }}
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2 text-[9px] text-muted-foreground font-medium">
              <span>Seg</span><span>Ter</span><span>Qua</span><span>Qui</span><span>Sex</span><span>Sáb</span><span>Dom</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="size-9 bg-muted rounded-lg grid place-items-center text-[11px] font-bold">TC</div>
                <div>
                  <p className="text-sm font-semibold">TechnoCore Lda</p>
                  <p className="text-[10px] text-muted-foreground">Cotação #2024-082</p>
                </div>
              </div>
              <span className="px-2 py-1 bg-amber-100 text-amber-700 text-[10px] font-bold rounded">PENDENTE</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="size-9 bg-muted rounded-lg grid place-items-center text-[11px] font-bold">MZ</div>
                <div>
                  <p className="text-sm font-semibold">Moz Logistics</p>
                  <p className="text-[10px] text-muted-foreground">Factura #FT-0012</p>
                </div>
              </div>
              <span className="px-2 py-1 bg-brand/15 text-brand text-[10px] font-bold rounded">PAGO</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
