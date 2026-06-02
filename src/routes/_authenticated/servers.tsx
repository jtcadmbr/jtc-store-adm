import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Server, Plus, Trash2, Database, Loader2, Key, Globe } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/_authenticated/servers")({
  component: ServersPage,
});

function ServersPage() {
  const qc = useQueryClient();
  const { data: servers, isLoading } = useQuery({
    queryKey: ["storage_servers"],
    queryFn: async () => {
      const { data, error } = await supabase.from("storage_servers").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [key, setKey] = useState("");
  const [saving, setSaving] = useState(false);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const { error } = await supabase.from("storage_servers").insert({ name, endpoint_url: url, api_key: key });
    setSaving(false);
    if (error) { toast.error("Erro ao salvar", { description: error.message }); return; }
    toast.success("Servidor cadastrado");
    setName(""); setUrl(""); setKey(""); setOpen(false);
    qc.invalidateQueries({ queryKey: ["storage_servers"] });
  }

  async function remove(id: string) {
    if (!confirm("Excluir este servidor?")) return;
    const { error } = await supabase.from("storage_servers").delete().eq("id", id);
    if (error) { toast.error("Erro ao excluir"); return; }
    toast.success("Servidor removido");
    qc.invalidateQueries({ queryKey: ["storage_servers"] });
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Configurações</p>
          <h1 className="text-3xl md:text-4xl font-bold mt-1">Servidores de Armazenamento</h1>
          <p className="text-muted-foreground mt-1">Provedores externos para hospedar os arquivos APK.</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-primary text-primary-foreground shadow-glow"><Plus className="w-4 h-4 mr-2" /> Novo servidor</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Cadastrar conexão</DialogTitle>
              <DialogDescription>Adicione um bucket Supabase, Firebase ou endpoint de Storage.</DialogDescription>
            </DialogHeader>
            <form onSubmit={save} className="space-y-4">
              <div className="space-y-2">
                <Label>Nome do servidor</Label>
                <Input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex.: Firebase Principal" />
              </div>
              <div className="space-y-2">
                <Label>URL do Endpoint</Label>
                <Input required type="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://..." />
              </div>
              <div className="space-y-2">
                <Label>Chave de API / Token</Label>
                <Input required type="password" value={key} onChange={(e) => setKey(e.target.value)} placeholder="••••••••" />
              </div>
              <DialogFooter>
                <Button type="submit" disabled={saving} className="bg-gradient-primary text-primary-foreground">
                  {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null} Salvar conexão
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </header>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        {isLoading ? (
          <div className="p-8 flex justify-center"><Loader2 className="w-5 h-5 animate-spin text-muted-foreground" /></div>
        ) : !servers?.length ? (
          <div className="p-10 text-center">
            <Database className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
            <p className="font-medium">Nenhum servidor cadastrado</p>
            <p className="text-sm text-muted-foreground mt-1">A JTC Store usará o armazenamento interno por padrão.</p>
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {servers.map((s) => (
              <li key={s.id} className="p-4 flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center shrink-0">
                  <Server className="w-5 h-5 text-primary-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold">{s.name}</p>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 mt-1 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1 truncate"><Globe className="w-3 h-3" />{s.endpoint_url}</span>
                    <span className="flex items-center gap-1"><Key className="w-3 h-3" />••••{s.api_key.slice(-4)}</span>
                  </div>
                </div>
                <Button size="icon" variant="ghost" onClick={() => remove(s.id)} className="text-destructive hover:bg-destructive/10">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
