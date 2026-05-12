import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth, formatMZN } from "@/hooks/use-auth";
import { useState, useMemo } from "react";
import { toast } from "sonner";
import { Plus, Trash2, FileText, X } from "lucide-react";

export const Route = createFileRoute("/_authenticated/facturas")({
  component: InvoicesPage,
});

type Invoice = { id: string; number: string; total: number; status: string; type: string; issue_date: string; customer_id: string | null };
type Customer = { id: string; name: string };
type Product = { id: string; name: string; price: number; vat: number };
type LineItem = { description: string; quantity: number; unit_price: number; vat: number };

const statusLabels: Record<string, { label: string; cls: string }> = {
  draft: { label: "Rascunho", cls: "bg-muted text-muted-foreground" },
  sent: { label: "Enviada", cls: "bg-amber-500/10 text-amber-700" },
  paid: { label: "Paga", cls: "bg-brand/10 text-brand" },
  cancelled: { label: "Anulada", cls: "bg-destructive/10 text-destructive" },
};
const typeLabels: Record<string, string> = { quote: "Cotação", invoice: "Factura", receipt: "Recibo" };

function InvoicesPage() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);

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

  const { data: invoices } = useQuery({
    queryKey: ["invoices", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase.from("invoices").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data as Invoice[];
    },
  });

  const { data: customers } = useQuery({
    queryKey: ["customers-pick", user?.id], enabled: !!user,
    queryFn: async () => (await supabase.from("customers").select("id,name")).data as Customer[],
  });
  const { data: products } = useQuery({
    queryKey: ["products-pick", user?.id], enabled: !!user,
    queryFn: async () => (await supabase.from("products").select("id,name,price,vat")).data as Product[],
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: "draft" | "sent" | "paid" | "cancelled" }) => {
      const { error } = await supabase.from("invoices").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Estado atualizado");
      qc.invalidateQueries({ queryKey: ["invoices"] });
    },
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("invoices").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["invoices"] }),
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold">Facturas & Cotações</h1>
          <p className="text-muted-foreground">Gere os seus documentos comerciais.</p>
        </div>
        <button onClick={() => setOpen(true)} className="inline-flex items-center gap-2 px-4 py-2.5 bg-brand text-brand-foreground rounded-lg font-semibold text-sm shadow-elegant">
          <Plus className="size-4" /> Nova factura
        </button>
      </div>

      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-surface-soft text-muted-foreground text-xs uppercase tracking-wider">
            <tr>
              <th className="text-left p-4 font-semibold">Nº</th>
              <th className="text-left p-4 font-semibold hidden md:table-cell">Tipo</th>
              <th className="text-left p-4 font-semibold hidden md:table-cell">Data</th>
              <th className="text-right p-4 font-semibold">Total</th>
              <th className="text-left p-4 font-semibold">Estado</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {(invoices ?? []).length === 0 && (
              <tr><td colSpan={6} className="p-12 text-center text-muted-foreground">
                <FileText className="size-12 mx-auto mb-3 opacity-30" />
                <p>Sem facturas ainda. Crie a primeira!</p>
              </td></tr>
            )}
            {(invoices ?? []).map((i) => (
              <tr key={i.id}>
                <td className="p-4 font-mono font-semibold">{i.number}</td>
                <td className="p-4 hidden md:table-cell">{typeLabels[i.type]}</td>
                <td className="p-4 hidden md:table-cell text-muted-foreground">{new Date(i.issue_date).toLocaleDateString("pt-PT")}</td>
                <td className="p-4 text-right font-mono font-semibold">{formatMZN(i.total)}</td>
                <td className="p-4">
                  <select
                    value={i.status}
                    onChange={(e) => updateStatus.mutate({ id: i.id, status: e.target.value as "draft" | "sent" | "paid" | "cancelled" })}
                    className={`text-xs font-bold px-2 py-1 rounded-full border-0 ${statusLabels[i.status]?.cls}`}
                  >
                    {Object.entries(statusLabels).map(([v, s]) => <option key={v} value={v}>{s.label}</option>)}
                  </select>
                </td>
                <td className="p-4 text-right">
                  <button onClick={() => remove.mutate(i.id)} className="p-2 text-muted-foreground hover:text-destructive"><Trash2 className="size-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {open && company && (
        <NewInvoiceModal
          companyId={company.id} ownerId={user!.id}
          customers={customers ?? []} products={products ?? []}
          onClose={() => setOpen(false)}
          onSaved={() => { setOpen(false); qc.invalidateQueries({ queryKey: ["invoices"] }); }}
        />
      )}
    </div>
  );
}

function NewInvoiceModal({ companyId, ownerId, customers, products, onClose, onSaved }: {
  companyId: string; ownerId: string; customers: Customer[]; products: Product[];
  onClose: () => void; onSaved: () => void;
}) {
  const [type, setType] = useState<"invoice" | "quote" | "receipt">("invoice");
  const [customerId, setCustomerId] = useState<string>("");
  const [items, setItems] = useState<LineItem[]>([{ description: "", quantity: 1, unit_price: 0, vat: 16 }]);
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState(false);

  const totals = useMemo(() => {
    let subtotal = 0, vat = 0;
    for (const it of items) {
      const line = it.quantity * it.unit_price;
      subtotal += line;
      vat += line * (it.vat / 100);
    }
    return { subtotal, vat, total: subtotal + vat };
  }, [items]);

  const addItem = () => setItems([...items, { description: "", quantity: 1, unit_price: 0, vat: 16 }]);
  const updateItem = (i: number, patch: Partial<LineItem>) => setItems(items.map((it, idx) => idx === i ? { ...it, ...patch } : it));
  const removeItem = (i: number) => setItems(items.filter((_, idx) => idx !== i));
  const pickProduct = (i: number, productId: string) => {
    const p = products.find((x) => x.id === productId);
    if (p) updateItem(i, { description: p.name, unit_price: Number(p.price), vat: Number(p.vat) });
  };

  const save = async () => {
    setBusy(true);
    try {
      const number = `${type === "quote" ? "COT" : type === "receipt" ? "REC" : "FAC"}-${Date.now().toString().slice(-6)}`;
      const { data: invoice, error } = await supabase.from("invoices").insert({
        owner_id: ownerId, company_id: companyId,
        customer_id: customerId || null, number, type,
        subtotal: totals.subtotal, vat_total: totals.vat, total: totals.total,
        notes: notes || null,
      }).select().single();
      if (error) throw error;
      if (items.length > 0) {
        const { error: e2 } = await supabase.from("invoice_items").insert(
          items.map((it) => ({
            invoice_id: invoice.id, owner_id: ownerId,
            description: it.description, quantity: it.quantity, unit_price: it.unit_price, vat: it.vat,
            total: it.quantity * it.unit_price * (1 + it.vat / 100),
          }))
        );
        if (e2) throw e2;
      }
      toast.success("Factura criada");
      onSaved();
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Erro");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 overflow-y-auto p-4" onClick={onClose}>
      <div className="bg-card rounded-2xl p-6 max-w-3xl w-full mx-auto my-8" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-display text-2xl font-bold">Nova factura</h2>
          <button onClick={onClose}><X className="size-5" /></button>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="text-xs font-semibold mb-1 block">Tipo</label>
            <select value={type} onChange={(e) => setType(e.target.value as "invoice" | "quote" | "receipt")} className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm">
              <option value="invoice">Factura</option>
              <option value="quote">Cotação</option>
              <option value="receipt">Recibo</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold mb-1 block">Cliente</label>
            <select value={customerId} onChange={(e) => setCustomerId(e.target.value)} className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm">
              <option value="">— Sem cliente —</option>
              {customers.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
        </div>

        <div className="space-y-3 mb-4">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-sm">Itens</h3>
            <button onClick={addItem} className="text-xs text-brand font-semibold flex items-center gap-1"><Plus className="size-3" /> Adicionar</button>
          </div>
          {items.map((it, i) => (
            <div key={i} className="grid grid-cols-12 gap-2 items-start bg-surface-soft p-3 rounded-lg">
              <div className="col-span-12 sm:col-span-5">
                <select onChange={(e) => e.target.value && pickProduct(i, e.target.value)} value="" className="w-full mb-1 px-2 py-1.5 bg-background border border-border rounded text-xs">
                  <option value="">— Escolher produto —</option>
                  {products.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
                <input value={it.description} onChange={(e) => updateItem(i, { description: e.target.value })} placeholder="Descrição" className="w-full px-2 py-1.5 bg-background border border-border rounded text-sm" />
              </div>
              <input type="number" min="0" step="0.01" value={it.quantity} onChange={(e) => updateItem(i, { quantity: Number(e.target.value) })} className="col-span-3 sm:col-span-2 px-2 py-1.5 bg-background border border-border rounded text-sm" placeholder="Qtd" />
              <input type="number" min="0" step="0.01" value={it.unit_price} onChange={(e) => updateItem(i, { unit_price: Number(e.target.value) })} className="col-span-4 sm:col-span-2 px-2 py-1.5 bg-background border border-border rounded text-sm" placeholder="Preço" />
              <input type="number" min="0" value={it.vat} onChange={(e) => updateItem(i, { vat: Number(e.target.value) })} className="col-span-3 sm:col-span-2 px-2 py-1.5 bg-background border border-border rounded text-sm" placeholder="IVA%" />
              <button onClick={() => removeItem(i)} className="col-span-2 sm:col-span-1 p-2 text-muted-foreground hover:text-destructive justify-self-end"><Trash2 className="size-4" /></button>
            </div>
          ))}
        </div>

        <div>
          <label className="text-xs font-semibold mb-1 block">Notas</label>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm" />
        </div>

        <div className="bg-surface-soft rounded-xl p-4 mt-4 space-y-1 text-sm">
          <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span className="font-mono">{formatMZN(totals.subtotal)}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">IVA</span><span className="font-mono">{formatMZN(totals.vat)}</span></div>
          <div className="flex justify-between border-t border-border pt-2 mt-2 font-bold text-base"><span>Total</span><span className="font-mono">{formatMZN(totals.total)}</span></div>
        </div>

        <div className="flex gap-2 mt-6">
          <button onClick={onClose} className="flex-1 py-2.5 border border-border rounded-lg text-sm font-semibold">Cancelar</button>
          <button onClick={save} disabled={busy} className="flex-1 py-2.5 bg-brand text-brand-foreground rounded-lg text-sm font-bold shadow-elegant">{busy ? "..." : "Criar factura"}</button>
        </div>
      </div>
    </div>
  );
}
