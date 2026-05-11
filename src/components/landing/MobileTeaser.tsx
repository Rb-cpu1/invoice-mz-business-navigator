import { Check } from "lucide-react";

export function MobileTeaser() {
  return (
    <section className="px-6 lg:px-8 py-24 bg-brand-dark text-white overflow-hidden">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-brand mb-4">Mobile First</p>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
            Leve a sua empresa no bolso
          </h2>
          <p className="text-white/60 text-lg mb-8 max-w-md">
            Disponível em breve para iOS e Android. Controle as suas finanças a partir de qualquer
            lugar em Moçambique, mesmo com ligações lentas.
          </p>
          <ul className="space-y-4 mb-10">
            {["PWA — funciona offline", "Notificações WhatsApp integradas", "Sincronização em tempo real", "Backup automático na cloud"].map((item) => (
              <li key={item} className="flex items-center gap-3 text-white/80">
                <div className="size-5 rounded-full bg-brand/20 flex items-center justify-center">
                  <Check className="size-3 text-brand" />
                </div>
                {item}
              </li>
            ))}
          </ul>
          <div className="flex gap-3">
            <div className="px-5 py-3 bg-white/5 rounded-xl border border-white/10 text-sm font-bold">App Store</div>
            <div className="px-5 py-3 bg-white/5 rounded-xl border border-white/10 text-sm font-bold">Google Play</div>
          </div>
        </div>

        <div className="relative flex justify-center">
          <div className="w-64 h-[500px] bg-slate-800 rounded-[2.5rem] border-[10px] border-slate-700 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-6 bg-slate-900 w-32 mx-auto rounded-b-2xl z-10" />
            <div className="p-5 pt-12 h-full bg-gradient-to-b from-slate-900 to-slate-800">
              <div className="flex items-center gap-2 mb-6">
                <div className="size-9 bg-brand rounded-xl grid place-items-center text-brand-foreground font-bold">I</div>
                <div>
                  <p className="text-[10px] text-white/50">Bem-vindo</p>
                  <p className="text-sm font-bold">Empresa Lda</p>
                </div>
              </div>
              <div className="p-4 bg-brand/10 border border-brand/20 rounded-2xl mb-3">
                <p className="text-[10px] text-white/60">Vendas hoje</p>
                <p className="text-xl font-bold text-brand">23.500 MT</p>
              </div>
              <div className="space-y-2">
                <div className="h-14 w-full bg-white/5 rounded-xl border border-white/5" />
                <div className="h-14 w-full bg-white/5 rounded-xl border border-white/5" />
                <div className="h-14 w-full bg-white/5 rounded-xl border border-white/5" />
              </div>
            </div>
          </div>
          <div className="absolute -bottom-10 -right-10 size-48 bg-brand blur-[120px] opacity-30" />
        </div>
      </div>
    </section>
  );
}
