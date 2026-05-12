import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth, formatMZN } from "@/hooks/use-auth";
import { TrendingUp, FileText, Users, Package, ArrowUpRight } from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: DashboardPage,
});

function DashboardPage() {
  const { user } = useAuth();

  const { data: stats } = useQuery({
    queryKey: ["dashboard", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const [invoices, customers, products] = await Promise.all([
        supabase.from("invoices").select("total,status,issue_date,type"),
        supabase.from("customers").select("id", { count: "exact", head: true }),
        supabase.from("products").select("id,stock", { count: "exact" }),
      ]);
      const inv = invoices.data ?? [];
      const totalRevenue = inv.filter((i) => i.status === "paid").reduce((s, i) => s + Number(i.total || 0), 0);
      const pending = inv.filter((i) => i.status === "sent").reduce((s, i) => s + Number(i.total || 0), 0);
      const lowStock = (products.data ?? []).filter((p: { stock: number }) => Number(p.stock) <= 5).length;
      return {
        totalRevenue,
        pending,
        invoiceCount: inv.length,
        customerCount: customers.count ?? 0,
        productCount: products.count ?? 0,
        lowStock,
      };
    },
  });

  const cards = [
    { label: "Receita (pagas)", value: formatMZN(stats?.totalRevenue ?? 0), icon: TrendingUp, accent: "bg-brand/10 text-brand" },
    { label: "Por receber", value: formatMZN(stats?.pending ?? 0), icon: ArrowUpRight, accent: "bg-amber-500/10 text-amber-600" },
    { label: "Facturas", value: String(stats?.invoiceCount ?? 0), icon: FileText, accent: "bg-indigo-500/10 text-indigo-600" },
    { label: "Clientes", value: String(stats?.customerCount ?? 0), icon: Users, accent: "bg-emerald-500/10 text-emerald-600" },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold">Olá 👋</h1>
        <p className="text-muted-foreground">Resumo do seu negócio.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => (
          <div key={c.label} className="bg-card rounded-2xl p-6 border border-border">
            <div className={`size-10 rounded-xl grid place-items-center mb-4 ${c.accent}`}>
              <c.icon className="size-5" />
            </div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">{c.label}</p>
            <p className="font-display text-2xl font-bold mt-1">{c.value}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-2xl p-6 border border-border">
          <h3 className="font-display font-bold text-lg mb-1">Stock</h3>
          <p className="text-muted-foreground text-sm mb-4">{stats?.productCount ?? 0} produtos · {stats?.lowStock ?? 0} com stock baixo</p>
          <div className="flex items-center gap-3">
            <Package className="size-12 text-brand" />
            <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-brand" style={{ width: `${Math.min(100, ((stats?.productCount ?? 0) / 50) * 100)}%` }} />
            </div>
          </div>
        </div>
        <div className="bg-brand-dark text-white rounded-2xl p-6">
          <h3 className="font-display font-bold text-lg mb-2">Comece a facturar</h3>
          <p className="text-white/60 text-sm mb-4">Crie a sua primeira factura profissional em segundos.</p>
          <a href="/facturas" className="inline-block px-5 py-2.5 bg-brand text-brand-foreground rounded-lg text-sm font-bold">Nova factura</a>
        </div>
      </div>
    </div>
  );
}
