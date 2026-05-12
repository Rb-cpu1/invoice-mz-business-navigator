import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/definicoes")({
  component: SettingsPage,
});

function SettingsPage() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [form, setForm] = useState({ name: "", nuit: "", address: "", phone: "", email: "", default_vat: "16" });

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

  useEffect(() => {
    if (company) setForm({
      name: company.name ?? "", nuit: company.nuit ?? "", address: company.address ?? "",
      phone: company.phone ?? "", email: company.email ?? "", default_vat: String(company.default_vat ?? 16),
    });
  }, [company]);

  const save = useMutation({
    mutationFn: async () => {
      if (!company) return;
      const { error } = await supabase.from("companies").update({
        name: form.name, nuit: form.nuit || null, address: form.address || null,
        phone: form.phone || null, email: form.email || null, default_vat: Number(form.default_vat),
      }).eq("id", company.id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Definições guardadas");
      qc.invalidateQueries({ queryKey: ["company"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold">Definições da empresa</h1>
        <p className="text-muted-foreground">Estes dados aparecem nas suas facturas.</p>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); save.mutate(); }} className="bg-card rounded-2xl p-6 border border-border space-y-4">
        {([
          ["name", "Nome da empresa *"],
          ["nuit", "NUIT"],
          ["address", "Endereço"],
          ["phone", "Telefone"],
          ["email", "Email"],
          ["default_vat", "IVA padrão (%)"],
        ] as const).map(([key, label]) => (
          <div key={key}>
            <label className="text-xs font-semibold mb-1 block">{label}</label>
            <input
              required={key === "name"}
              type={key === "default_vat" ? "number" : "text"}
              value={form[key]}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              className="w-full px-3 py-2.5 bg-background border border-border rounded-lg text-sm"
            />
          </div>
        ))}
        <button type="submit" disabled={save.isPending} className="w-full py-3 bg-brand text-brand-foreground rounded-lg font-bold shadow-elegant">
          {save.isPending ? "A guardar..." : "Guardar"}
        </button>
      </form>
    </div>
  );
}
