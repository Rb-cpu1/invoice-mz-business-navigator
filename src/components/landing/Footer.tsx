export function Footer() {
  return (
    <footer className="border-t border-border py-12 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-2.5">
          <div className="size-8 bg-brand rounded-lg grid place-items-center text-brand-foreground font-bold">I</div>
          <span className="font-display text-base font-extrabold tracking-tight">
            INVOICE <span className="text-brand">MZ</span>
          </span>
        </div>
        <p className="text-muted-foreground text-sm">© 2026 INVOICE MZ. Feito com orgulho em Maputo.</p>
        <div className="flex gap-6 text-sm">
          <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Termos</a>
          <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Privacidade</a>
          <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">Suporte</a>
        </div>
      </div>
    </footer>
  );
}
