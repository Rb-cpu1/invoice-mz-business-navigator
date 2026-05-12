import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2, Search } from "lucide-react";

export const Route = createFileRoute("/_authenticated/clientes")({
  component: ClientsPage,
});

type Customer = { id: string; name: string; nuit: string | null; email: string | null; phone: string | null; address: string | null };

function ClientsPage() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({ name: "", nuit: "", email: "", phone: "", address: "" });

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

  const { data: customers } = useQuery({
    queryKey: ["customers", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase.from("customers").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data as Customer[];
    },
  });

  const create = useMutation({
    mutationFn: async () => {
      if (!user || !company) throw new Error("Sem empresa");
      const { error } = await supabase.from("customers").insert({ ...form, owner_id: user.id, company_id: company.id });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Cliente criado");
      setOpen(false);
      setForm({ name: "", nuit: "", email: "", phone: "", address: "" });
      qc.invalidateQueries({ queryKey: ["customers"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("customers").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Cliente removido");
      qc.invalidateQueries({ queryKey: ["customers"] });
    },
  });

  const filtered = (customers ?? []).filter((c) => c.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold">Clientes</h1>
          <p className="text-muted-foreground">Gere a sua base de clientes.</p>
        </div>
        <button onClick={() => setOpen(true)} className="inline-flex items-center gap-2 px-4 py-2.5 bg-brand text-brand-foreground rounded-lg font-semibold text-sm shadow-elegant">
          <Plus className="size-4" /> Novo cliente
        </button>
      </div>

      <div className="bg-card rounded-2xl border border-border">
        <div className="p-4 border-b border-border flex items-center gap-2">
          <Search className="size-4 text-muted-foreground" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Pesquisar..." className="flex-1 bg-transparent outline-none text-sm" />
        </div>
        <div className="divide-y divide-border">
          {filtered.length === 0 && <p className="p-8 text-center text-muted-foreground text-sm">Sem clientes ainda.</p>}
          {filtered.map((c) => (
            <div key={c.id} className="p-4 flex items-center gap-4">
              <div className="size-10 rounded-full bg-brand/10 text-brand grid place-items-center font-bold">{c.name[0]?.toUpperCase()}</div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate">{c.name}</p>
                <p className="text-xs text-muted-foreground truncate">{c.email || c.phone || c.nuit || "—"}</p>
              </div>
              <button onClick={() => remove.mutate(c.id)} className="p-2 text-muted-foreground hover:text-destructive">
                <Trash2 className="size-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/50 grid place-items-center p-4" onClick={() => setOpen(false)}>
          <div className="bg-card rounded-2xl p-6 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <h2 className="font-display text-xl font-bold mb-4">Novo cliente</h2>
            <form onSubmit={(e) => { e.preventDefault(); create.mutate(); }} className="space-y-3">
              {(["name","nuit","email","phone","address"] as const).map((f) => (
                <div key={f}>
                  <label className="text-xs font-semibold mb-1 block capitalize">{f === "name" ? "Nome *" : f === "nuit" ? "NUIT" : f === "email" ? "Email" : f === "phone" ? "Telefone" : "Endereço"}</label>
                  <input
                    required={f === "name"}
                    value={form[f]} onChange={(e) => setForm({ ...form, [f]: e.target.value })}
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm"
                  />
                </div>
              ))}
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
