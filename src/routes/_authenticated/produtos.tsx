import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth, formatMZN } from "@/hooks/use-auth";
import { useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2, AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/_authenticated/produtos")({
  component: ProductsPage,
});

type Product = { id: string; name: string; sku: string | null; price: number; stock: number; unit: string; vat: number };

function ProductsPage() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", sku: "", price: "0", stock: "0", unit: "un", vat: "16" });

  const { data: company } = useQuery({
    queryKey: ["company", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data } = await supabase.from("companies").select("*").limit(1).maybeSingle();
      if (!data && user) {
        const { data: created } = await supabase.from("companies").insert({ owner_id: user.id, name: "Minha Empresa" }).select().single();
        return created;
      }
      return data;
    },
  });

  const { data: products } = useQuery({
    queryKey: ["products", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data as Product[];
    },
  });

  const create = useMutation({
    mutationFn: async () => {
      if (!user || !company) throw new Error("Sem empresa");
      const { error } = await supabase.from("products").insert({
        owner_id: user.id, company_id: company.id,
        name: form.name, sku: form.sku || null,
        price: Number(form.price), stock: Number(form.stock),
        unit: form.unit, vat: Number(form.vat),
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Produto criado");
      setOpen(false);
      setForm({ name: "", sku: "", price: "0", stock: "0", unit: "un", vat: "16" });
      qc.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["products"] }),
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold">Produtos & Stock</h1>
          <p className="text-muted-foreground">Controle preços e existências.</p>
        </div>
        <button onClick={() => setOpen(true)} className="inline-flex items-center gap-2 px-4 py-2.5 bg-brand text-brand-foreground rounded-lg font-semibold text-sm shadow-elegant">
          <Plus className="size-4" /> Novo produto
        </button>
      </div>

      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-surface-soft text-muted-foreground text-xs uppercase tracking-wider">
            <tr>
              <th className="text-left p-4 font-semibold">Produto</th>
              <th className="text-left p-4 font-semibold hidden md:table-cell">SKU</th>
              <th className="text-right p-4 font-semibold">Preço</th>
              <th className="text-right p-4 font-semibold">Stock</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {(products ?? []).length === 0 && (
              <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">Sem produtos ainda.</td></tr>
            )}
            {(products ?? []).map((p) => (
              <tr key={p.id}>
                <td className="p-4 font-semibold">{p.name}</td>
                <td className="p-4 text-muted-foreground hidden md:table-cell">{p.sku || "—"}</td>
                <td className="p-4 text-right font-mono">{formatMZN(p.price)}</td>
                <td className="p-4 text-right">
                  <span className={`inline-flex items-center gap-1 ${p.stock <= 5 ? "text-amber-600" : ""}`}>
                    {p.stock <= 5 && <AlertTriangle className="size-3" />}
                    {p.stock} {p.unit}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <button onClick={() => remove.mutate(p.id)} className="p-2 text-muted-foreground hover:text-destructive"><Trash2 className="size-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/50 grid place-items-center p-4" onClick={() => setOpen(false)}>
          <div className="bg-card rounded-2xl p-6 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <h2 className="font-display text-xl font-bold mb-4">Novo produto</h2>
            <form onSubmit={(e) => { e.preventDefault(); create.mutate(); }} className="space-y-3">
              <Field label="Nome *" required value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
              <Field label="SKU" value={form.sku} onChange={(v) => setForm({ ...form, sku: v })} />
              <div className="grid grid-cols-2 gap-3">
                <Field label="Preço (MZN)" type="number" value={form.price} onChange={(v) => setForm({ ...form, price: v })} />
                <Field label="Stock" type="number" value={form.stock} onChange={(v) => setForm({ ...form, stock: v })} />
                <Field label="Unidade" value={form.unit} onChange={(v) => setForm({ ...form, unit: v })} />
                <Field label="IVA %" type="number" value={form.vat} onChange={(v) => setForm({ ...form, vat: v })} />
              </div>
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setOpen(false)} className="flex-1 py-2.5 border border-border rounded-lg text-sm font-semibold">Cancelar</button>
                <button type="submit" disabled={create.isPending} className="flex-1 py-2.5 bg-brand text-brand-foreground rounded-lg text-sm font-bold">{create.isPending ? "..." : "Guardar"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, value, onChange, type = "text", required }: { label: string; value: string; onChange: (v: string) => void; type?: string; required?: boolean }) {
  return (
    <div>
      <label className="text-xs font-semibold mb-1 block">{label}</label>
      <input
        required={required} type={type} value={value} onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm"
      />
    </div>
  );
}
