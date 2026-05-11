import { Link } from "@tanstack/react-router";

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-background/80 border-b border-border">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="size-9 bg-brand rounded-xl grid place-items-center text-brand-foreground font-bold text-lg shadow-elegant">
            I
          </div>
          <span className="font-display text-lg font-extrabold tracking-tight">
            INVOICE <span className="text-brand">MZ</span>
          </span>
        </Link>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          <a href="#funcionalidades" className="hover:text-foreground transition-colors">Funcionalidades</a>
          <a href="#precos" className="hover:text-foreground transition-colors">Preços</a>
          <a href="#empresas" className="hover:text-foreground transition-colors">Empresas</a>
        </div>
        <div className="flex items-center gap-2">
          <button className="hidden sm:inline-flex px-4 py-2 text-sm font-semibold text-foreground/80 hover:text-foreground">
            Entrar
          </button>
          <button className="px-4 py-2.5 bg-brand-dark text-white rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity">
            Criar Conta Grátis
          </button>
        </div>
      </div>
    </nav>
  );
}
