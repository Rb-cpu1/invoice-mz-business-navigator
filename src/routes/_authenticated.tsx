import { createFileRoute, Outlet, Link, useNavigate, useLocation } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import {
  LayoutDashboard, Users, Package, FileText, Settings, LogOut, Menu,
} from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/_authenticated")({
  component: AuthenticatedLayout,
});

const nav = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/facturas", label: "Facturas", icon: FileText },
  { to: "/clientes", label: "Clientes", icon: Users },
  { to: "/produtos", label: "Produtos", icon: Package },
  { to: "/definicoes", label: "Definições", icon: Settings },
] as const;

function AuthenticatedLayout() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth" });
  }, [user, loading, navigate]);

  if (loading || !user) {
    return <div className="min-h-screen grid place-items-center text-muted-foreground">A carregar...</div>;
  }

  const logout = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/auth" });
  };

  return (
    <div className="min-h-screen flex bg-surface-soft">
      {/* Sidebar */}
      <aside className={`${open ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 fixed lg:sticky top-0 left-0 z-40 h-screen w-64 bg-card border-r border-border flex flex-col transition-transform`}>
        <Link to="/dashboard" className="flex items-center gap-2.5 p-6 border-b border-border">
          <div className="size-9 bg-brand rounded-xl grid place-items-center text-brand-foreground font-bold">I</div>
          <span className="font-display text-base font-extrabold tracking-tight">
            INVOICE <span className="text-brand">MZ</span>
          </span>
        </Link>

        <nav className="flex-1 p-4 space-y-1">
          {nav.map((item) => {
            const active = location.pathname.startsWith(item.to);
            return (
              <Link
                key={item.to} to={item.to}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  active ? "bg-brand text-brand-foreground" : "text-muted-foreground hover:bg-accent hover:text-foreground"
                }`}
              >
                <item.icon className="size-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border">
          <div className="px-3 py-2 mb-2">
            <p className="text-xs text-muted-foreground">Sessão</p>
            <p className="text-sm font-semibold truncate">{user.email}</p>
          </div>
          <button onClick={logout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground">
            <LogOut className="size-4" />
            Terminar sessão
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 min-w-0 flex flex-col">
        <header className="lg:hidden sticky top-0 z-30 bg-background/80 backdrop-blur border-b border-border h-14 flex items-center px-4 gap-3">
          <button onClick={() => setOpen((v) => !v)} className="p-2 -ml-2"><Menu className="size-5" /></button>
          <span className="font-display font-bold">INVOICE <span className="text-brand">MZ</span></span>
        </header>
        <main className="flex-1 p-6 lg:p-10">
          <Outlet />
        </main>
      </div>

      {open && <div onClick={() => setOpen(false)} className="lg:hidden fixed inset-0 bg-black/40 z-30" />}
    </div>
  );
}
