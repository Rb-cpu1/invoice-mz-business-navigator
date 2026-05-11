export function CTA() {
  return (
    <section className="py-24 px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center bg-gradient-to-br from-brand-soft via-background to-background p-12 md:p-16 rounded-3xl border border-border">
        <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
          Pronto para profissionalizar o seu negócio?
        </h2>
        <p className="text-muted-foreground text-lg mb-10 max-w-xl mx-auto">
          Junte-se a centenas de empresas moçambicanas que já utilizam o INVOICE MZ para crescer.
        </p>
        <button className="px-10 py-5 bg-brand text-brand-foreground rounded-2xl font-bold text-lg shadow-elegant hover:scale-[1.02] transition-transform">
          Experimentar grátis por 14 dias
        </button>
        <p className="mt-6 text-xs text-muted-foreground">Sem cartão de crédito · Cancele a qualquer momento</p>
      </div>
    </section>
  );
}
