import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && user) navigate({ to: "/dashboard" });
  }, [user, loading, navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/dashboard`,
            data: { full_name: fullName },
          },
        });
        if (error) throw error;
        toast.success("Conta criada! Verifique o seu email.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Bem-vindo de volta!");
        navigate({ to: "/dashboard" });
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erro desconhecido";
      toast.error(message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      <div className="hidden lg:flex flex-col justify-between p-12 bg-brand-dark text-white">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="size-9 bg-brand rounded-xl grid place-items-center text-brand-foreground font-bold text-lg">I</div>
          <span className="font-display text-lg font-extrabold">INVOICE <span className="text-brand">MZ</span></span>
        </Link>
        <div>
          <h2 className="font-display text-4xl font-bold mb-4 leading-tight">
            Profissionalize a gestão do seu negócio em Moçambique.
          </h2>
          <p className="text-white/60">Facturas, cotações, stock e finanças num só lugar.</p>
        </div>
        <p className="text-xs text-white/40">© 2026 INVOICE MZ</p>
      </div>

      <div className="flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          <h1 className="font-display text-3xl font-bold mb-2">
            {mode === "signin" ? "Entrar" : "Criar conta grátis"}
          </h1>
          <p className="text-muted-foreground text-sm mb-8">
            {mode === "signin" ? "Aceda à sua conta INVOICE MZ." : "Comece em segundos. Sem cartão de crédito."}
          </p>

          <form onSubmit={submit} className="space-y-4">
            {mode === "signup" && (
              <div>
                <label className="text-sm font-semibold mb-1.5 block">Nome completo</label>
                <input
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-3 bg-card border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand"
                  placeholder="João Macamo"
                />
              </div>
            )}
            <div>
              <label className="text-sm font-semibold mb-1.5 block">Email</label>
              <input
                required type="email" value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-card border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand"
                placeholder="voce@empresa.co.mz"
              />
            </div>
            <div>
              <label className="text-sm font-semibold mb-1.5 block">Palavra-passe</label>
              <input
                required type="password" minLength={6} value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-card border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit" disabled={busy}
              className="w-full py-3.5 bg-brand text-brand-foreground rounded-xl font-bold text-sm shadow-elegant hover:opacity-90 disabled:opacity-50"
            >
              {busy ? "Aguarde..." : mode === "signin" ? "Entrar" : "Criar conta"}
            </button>
          </form>

          <p className="text-sm text-muted-foreground text-center mt-6">
            {mode === "signin" ? "Ainda não tem conta?" : "Já tem conta?"}{" "}
            <button onClick={() => setMode(mode === "signin" ? "signup" : "signin")} className="text-brand font-semibold hover:underline">
              {mode === "signin" ? "Criar conta" : "Entrar"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
